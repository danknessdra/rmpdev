import json
prof_file = open("../SJSUCourses.json")
data = json.load(prof_file)

professor = data["data"]["search"]["teachers"]["edges"]
out_file = open("professordata.json", "w") 
  
json.dump(professor, out_file) 
  
out_file.close() 