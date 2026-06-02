from django.shortcuts import render,redirect
from django.http import JsonResponse,HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import cv2
import csv
import io
import datetime
from django.utils import timezone
from ultralytics import YOLO
from .models import Students,Attendance,Login,Staff
import face_recognition
import numpy as np
import base64
import json
import os

model = YOLO('yolov8n.pt')
known_faces_dir = 'Students'

def ensure_admin_exists():
    try:
        if not Login.objects.filter(uid="Admin").exists():
            admin_login = Login.objects.create(
                uid="Admin",
                upass="12345",
                isstaff=True
            )
            print("Creating Admin in Staff Table...")
            Staff.objects.create(
                login_id="Admin",
                name="Admin"
            )
            print("Admin Created...")
    except Exception:
        pass
ensure_admin_exists()

def initialize_daily_attendance(request):
    date = request.GET.get("date")
    if date:
        try:
            tdate = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({"status": "failure", "message": "Invalid date format"}, status=400)
    else:
        tdate = timezone.now().date()
    existing_student_ids = Attendance.objects.filter(date=tdate).values_list('student_id', flat=True)
    missing_students = Students.objects.exclude(login_id__in=existing_student_ids)
    
    if not missing_students.exists():
        return JsonResponse({"status": "success", "message": "Already fully initialized"})
        
    attrecs = []
    for student in missing_students:
        attrecs.append(
            Attendance(
                student=student,
                date=tdate,
                attendance=False
            )
        )
    Attendance.objects.bulk_create(attrecs, ignore_conflicts=True)
    return JsonResponse({"status": "success"})

def hello(request):
    return JsonResponse({"status" : "Hello World!"})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def reccsv(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        if 'file' not in request.FILES:
            return JsonResponse({"status": "Failure"})
    csf = request.FILES['file']
    if not csf.name.endswith('.csv'):
        return JsonResponse({"status": "Failure"})

    try:
        ds = csf.read().decode('utf-8')
        ios = io.StringIO(ds)
        reader = csv.DictReader(ios)
        for row in reader:
            uid = row.get('uid')
            name = row.get('name')
            password = row.get('password')

            if not uid or not name or not password:
                continue  
            if not Login.objects.filter(uid=uid).exists():
                login = Login.objects.create(
                    uid=uid,
                    upass=password,
                    isstaff=False
                )
                Students.objects.create(
                    login=login,
                    sname=name
                )
        return JsonResponse({"status": "success"})

    except :
        return JsonResponse({"status": "Failure"})


@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def modatt(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        try:
            jdata = json.loads(request.body)
            recid = jdata.get('recid') 
            student_id = jdata.get('student_id') 
            date_str = jdata.get('date') 
            new_status = bool(jdata.get("attendance"))
            today = timezone.now().date()
            if date_str:
                target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                if target_date > today:
                    return JsonResponse({"status": "failure"})
            if recid:
                ad = Attendance.objects.filter(id=recid).first()
                if ad:
                    if ad.date > today:
                        return JsonResponse({"status": "failure"})
                    ad.attendance = new_status
                    ad.save(update_fields=['attendance'])
                    return JsonResponse({"status": "success"})

            if student_id and date_str:
                student_obj = Students.objects.filter(login_id=student_id).first()
                if not student_obj:
                    return JsonResponse({"status": "failure", "message": "Student record missing"})

                
                Attendance.objects.update_or_create(
                    student=student_obj,
                    date=target_date,
                    defaults={'attendance': new_status}
                )
                return JsonResponse({"status": "success"})
                
            return JsonResponse({"status": "failure", "message": "Insufficient parameters provided"})
        except Exception as e:
            return JsonResponse({"status": "Failure", "error": str(e)})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def daily(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "GET":
        date = request.GET.get("date")
        if not date:
            return JsonResponse({"status" : "Failure"})
        ad = Attendance.objects.filter(date=date).select_related("student").order_by("student__login_id")
        rl = list(ad.values("id","student__login_id","student__sname","date","attendance"))
        return JsonResponse({"status" :  "success","report" : rl})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def monthly(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "GET":
        student_id = request.GET.get("id")
        if not student_id:
            return JsonResponse({"status": "Failure", "message": "Missing student ID"})
        
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        if today.month == 12:
            end_of_month = today.replace(year=today.year + 1, month=1, day=1) - datetime.timedelta(days=1)
        else:
            end_of_month = today.replace(month=today.month + 1, day=1) - datetime.timedelta(days=1)
        student_obj = Students.objects.filter(login_id=student_id).first()
        if not student_obj:
            return JsonResponse({"status": "Failure", "message": "Student not found"})
        existing_records = Attendance.objects.filter(
            student=student_obj,
            date__range=[start_of_month, end_of_month]
        ).order_by("date")
        records_dict = {
            rec.date.strftime("%Y-%m-%d"): {
                "id": rec.id,
                "student__login_id": student_obj.login_id,
                "student__sname": student_obj.sname,
                "date": rec.date.strftime("%Y-%m-%d"),
                "attendance": rec.attendance
            }
            for rec in existing_records
        }
        report_list = []
        current_day = start_of_month
        while current_day <= end_of_month:
            date_str = current_day.strftime("%Y-%m-%d")
            if date_str in records_dict:
                report_list.append(records_dict[date_str])
            else:
                report_list.append({
                    "id": None, 
                    "student__login_id": student_obj.login_id,
                    "student__sname": student_obj.sname,
                    "date": date_str,
                    "attendance": False 
                })
            current_day += datetime.timedelta(days=1)

        return JsonResponse({"status": "success", "report": report_list})


@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def signin(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        jdata = json.loads(request.body)
        id = jdata.get("id")
        passw = jdata.get("pass")
        data = Login.objects.filter(uid=id).first()
        print(data)
        if data:
            if data.upass == passw:
                return JsonResponse({"status" : "success","isstaff" : data.isstaff})
            else:
                return JsonResponse({"status" : "failure"})
        else:
            return JsonResponse({"status" : "ID does not exist"})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def getstu(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "GET":
        id = request.GET.get("id") 
        sd = Students.objects.filter(login_id=id).values("login_id","sname")
        print(sd)
        if sd:
            sd = list(sd)
            return JsonResponse({"status": "success","studetails":sd})
        else:
            return JsonResponse({"status" : "Failure"})
        
@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def getstaff(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "GET":
        id = request.GET.get("id") 
        sd = Staff.objects.filter(login_id=id).values("login_id","name")
        print(sd)
        if sd:
            sd = list(sd)
            return JsonResponse({"status": "success","staffdetails":sd})
        else:
            return JsonResponse({"status" : "Failure"})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def rec_img(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        try:
            jdata = json.loads(request.body)
            b64str = jdata.get("image")
            id = jdata.get("id")
            if not(b64str):
                return JsonResponse({"success": False, "message": "No image data"}, status=400)
            header, encoded = b64str.split(',',1)
            data = base64.b64decode(encoded)
            save_path = "Students"
            if not os.path.exists(save_path):
                os.makedirs(save_path)
            file_name = f"{id}.png"
            full_path = os.path.join(save_path, file_name)
            with open(full_path,"wb") as f:
                f.write(data)
            return JsonResponse({"success" : True, "message" : "Image Received"})
        except Exception as e:
            return JsonResponse({"success" : False, "message" : "Failed to Receive Image"})
    else:
        return JsonResponse({'status': 'error',  'message': 'Only POST allowed'}, status=405)

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def reguser(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        try:
            jdata = json.loads(request.body)
            id = jdata.get("uid")
            name = jdata.get("name")
            passw = jdata.get("pass")
            ison = bool(jdata.get("stfornot"))
            login = Login.objects.create(
                uid = id,
                upass = passw,
                isstaff = ison
            )
            print(login)
            if ison:
                try:
                    print("entering staff")
                    ns = Staff.objects.create(
                        login_id = login,
                        name = name,
                    )
                except:
                    ns = Staff.objects.create(
                        login_id = id,
                        name = name,
                    )
                print("Exiting staff")
            else:
                try:
                    ns = Students.objects.create(
                        login_id = login,
                        sname = name
                    )
                except:
                    ns = Students.objects.create(
                        login_id = id,
                        sname = name
                    )
            return JsonResponse({"status" : "success"})
        except :
            log = Login.objects.filter(uid=id).first()
            if log:
                log.delete()
            else:
                pass
            return JsonResponse({"status" : "Failure"})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def train_model(request):
        KFE = []
        KFI = []
        for filename in os.listdir(known_faces_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                image_path=os.path.join(known_faces_dir, filename)
                img_bgr = cv2.imread(image_path)
                if img_bgr is None:
                    continue
                image_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(image_rgb, number_of_times_to_upsample=1, model="hog")
                face_encodings = face_recognition.face_encodings(image_rgb, face_locations)
                if face_encodings:
                    KFE.append(face_encodings[0])
                    nid = os.path.splitext(filename)[0]
                    if len(nid) == 10 and nid.startswith("25BFA0"):
                        nid = "25BFA" + nid[6:]
                    print(nid)
                    KFI.append(nid)
        print(KFI)
        with open("names.txt","w") as f:
            json.dump(KFI,f)
        np.save('face_encoding.npy',KFE)

        return JsonResponse({"status" : "Success"},status=200)

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def recog(request):
    try:
        KFE = np.load("face_encoding.npy")
    except:
        KFE = []
    try:
        with open("names.txt","r") as f:
            KFI = json.load(f)
    except:
        KFI = []
    idurl = None
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        jdata = json.loads(request.body)
        tdate = jdata.get("date")
        if tdate:
            try:
                date = datetime.datetime.strptime(tdate, "%Y-%m-%d").date()
            except ValueError:
                return JsonResponse({"status": "failure", "message": "Invalid date format"}, status=400)
        else:
            return JsonResponse({"status": "failure", "message": "Invalid date format"}, status=400)
        Attendance.objects.filter(date=date).delete()
                    
        attrecs = []
        for student in Students.objects.all():
            attrecs.append(
                Attendance(
                    student=student,
                    date=tdate,
                    attendance=False
                )
            )
        Attendance.objects.bulk_create(attrecs, ignore_conflicts=True)
        print(date)
        b64str = jdata.get("image")
        header, encoded = b64str.split(',',1)
        data = base64.b64decode(encoded)
        npd = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(npd, cv2.IMREAD_COLOR)
        results = model(frame)
        for result in results:
            for box in result.boxes:
                if int(box.cls)  == 0:
                    perdet = True

            if perdet:
                rgb_small_frame = np.ascontiguousarray(frame[:, :, ::-1])
                face_locations = face_recognition.face_locations(rgb_small_frame,number_of_times_to_upsample=1,model="hog")

                if face_locations is not None and face_locations:
                    face_encodings = face_recognition.face_encodings(rgb_small_frame,face_locations)
                    face_names = []

                    for face_encoding in face_encodings:
                        name = "unknown"

                        if len(KFE) > 0:
                            matches = face_recognition.compare_faces(KFE, face_encoding)
                            face_distances  = face_recognition.face_distance(KFE, face_encoding)

                            if len(face_distances) > 0:
                                best_match_index= np.argmin(face_distances)
                                if matches[best_match_index]:
                                    if matches[best_match_index]:
                                        stuid = KFI[best_match_index]
                                        studat = Students.objects.filter(login_id=stuid).first()
                                        if studat:
                                            name = studat.sname 
                                            Attendance.objects.update_or_create(
                                                student=studat,
                                                date=date,
                                                defaults={'attendance': True}
                                            )
                                        else:
                                            print("Studat failed!")
                        else:
                            print("KFE Failed")
                
                        face_names.append(name)
            for (top, right,bottom, left), name in zip(face_locations, face_names):
                box_color = (0, 255, 0) if name != "unknown" else (0, 0, 255)
                cv2.rectangle(frame, (left, top), (right, bottom), box_color,2)
                font= cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left+6, bottom-6),font, 0.75, (255,255,255), 1)
        else:
            print("No faces Detected!")

        _, buffer = cv2.imencode(".jpeg",frame)
        b64encoded = base64.b64encode(buffer).decode('utf-8')
        idurl = f"data:image/jpeg;base64,{b64encoded}"
        return JsonResponse({"success" : True, "image" : idurl})
    else:
        return JsonResponse({"success" : False,"Method" : "Invalid"},status=405)                    

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def test(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        jdata = json.loads(request.body)
        Students.objects.create(
        sid = jdata.get("id"),
        sname = jdata.get("fname") + jdata.get("lname"))
        return JsonResponse({"status" : "success"})
    else:
        return JsonResponse({"status" : "Method Not Allowed"},status=405)

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def search(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "GET":
        sd = Students.objects.all()
        data = list(sd.values("sid","sname"))
        return JsonResponse({"studetails" : data})

@csrf_exempt
@require_http_methods(["GET","POST","OPTIONS"])
def search_record(request):
    if request.method == "OPTIONS":
        return HttpResponse(status=200)
    if request.method == "POST":
        id = json.loads(request.body).get("id")
        sd = Students.objects.filter(sid=id)
        data = list(sd.values("sid","sname"))
        return JsonResponse({"studetails" : data})

