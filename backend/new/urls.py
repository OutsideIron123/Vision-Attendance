from django.urls import include, path
from . import views

urlpatterns = [
    path("imgcomm/",views.rec_img,name="image Communication"),
    path("train/",views.train_model,name="Train Model"),
    path("recog/",views.recog,name="Recognize "),
    path("hello/",views.hello,name="hello"),
    path("signin/",views.signin,name="Sign In!"),
    path("getstu/",views.getstu,name="Get Student"),
    path("getstaff/",views.getstaff,name="Get Staff"),
    path("init/",views.initialize_daily_attendance,name="Initialize"),
    path("reguser/",views.reguser,name="Register User"),
    path("getdaily/",views.daily,name="Day-wise Report"),
    path("getmonthly/",views.monthly,name="Month Report"),
    path("modatt/",views.modatt,name="Modify Attendance"),
    path("reccsv/",views.reccsv,name="Receive CSV")
]