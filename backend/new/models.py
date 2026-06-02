from django.db import models
import datetime

class Login(models.Model):
    uid = models.CharField(max_length=15,primary_key=True)
    upass = models.CharField(max_length=20)
    isstaff = models.BooleanField(default=False)

class Students(models.Model):
    login = models.OneToOneField(Login,on_delete=models.CASCADE,primary_key=True)
    sname = models.CharField(max_length=50)
    

class Staff(models.Model):
    login = models.OneToOneField(Login,on_delete=models.CASCADE,primary_key=True)
    name = models.CharField(max_length=50)
    

class Attendance(models.Model):
    student = models.ForeignKey(Students,on_delete=models.CASCADE)
    date = models.DateField(default=datetime.date.today)
    attendance = models.BooleanField(default=False)



