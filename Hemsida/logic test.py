import math  
    
a = math.pi / 6
     
# returning the value of sine of pi / 6  
print ("The value of sine of pi / 6 is : ", end ="")  
print (math.sin(a)) 
hej = [0,1]
if hej[0] != 0:
    a =math.asin(hej[0])
else:
    a=math.acos(hej[1])
for x in range(9):
    a+= math.pi/2
    ree = [int(math.sin(a)),int(math.cos(a))]
    hej = ree
    print(ree)
