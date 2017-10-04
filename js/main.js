document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('date').valueAsDate = new Date();
	loadTasks((JSON.parse(loadLocal())));
	function closeIt()
	{
	  saveLocal(JSON.stringify(generateObjTasks()));
	}
	window.onbeforeunload = closeIt;
});

var i = 0;

function generateObjTasks(){
	var tasksObj = {};
	var task = {};
	var tasks = document.getElementsByClassName("task");
	tasksObj.tasks = [];
	for(var i = 0; i < tasks.length; i++){
		var tmp = tasks.item(i);
		task = {};
		task.ctatus = tmp.childNodes[0].checked;
		task.name = tmp.childNodes[1].firstChild.nodeValue;
		task.date = tmp.childNodes[3].firstChild.nodeValue;
		tasksObj.tasks.push(task);
	}
	console.log(tasksObj);
	return tasksObj;
}

function addTaskButton(){
	var tx = document.getElementById('task').value;
	var date = document.getElementById('date').value;
	addTask(false,tx,date);
}

function addTask(status,txt,date){
	i++;	
    var container = document.getElementById('container');
    var div = document.createElement('div');
	div.className = 'task flex-itm-task';
	div.id = ''+i;
	var checkStat;
	if(status){
		checkStat = "checked";
	}else{
		checkStat = "";
	}
    div.innerHTML = '<input type="checkbox"'+checkStat+' id="check'+i+'"/><span class="task-name"> '+txt+'</span> <span class="date">'+date+'</span><span class="close" id="close'+i+'"> &times </span>';
    container.appendChild(div);
	var check;
	if(status){
		check = document.getElementById('check'+i);
		task = check.parentNode;
		task.classList.add("checked");			
	}
	var close = document.getElementById('close'+i);
	close.onclick = removeTask;
	check = document.getElementById('check'+i);
	check.onchange  = function(){
				var task = this.parentNode;
				if(!task.classList.contains("checked")){
					task.classList.add("checked");
				}else{
					task.classList.remove("checked");
				}
	};
	//console.log(generateObjTasks());
}

function loadTasks(tasksObj){
	if(tasksObj){
		var arr = tasksObj.tasks;
		var i = 0;
		arr.forEach(function(item, i, arr) {
			addTask(item.ctatus,item.name,item.date);
			i++;
		});
	}
}

function removeTask(){
	var container = document.getElementById('container');
	container.removeChild(this.parentNode);	
	
	//saveLocal(JSON.stringify(generateObjTasks()));
	//loadTasks((JSON.parse(loadLocal())));
}

function openFile(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      console.log(reader.result.substring(0, 200));

	  loadTasks(JSON.parse(text));
    };
    reader.readAsText(input.files[0]);
 };

function load(){
	downloadTxt(JSON.stringify(generateObjTasks()));
}

function downloadTxt(text) {
	var a = document.getElementById("a");
	var file = new Blob([text], {type: 'text/plain'});
	a.href = URL.createObjectURL(file);
	//window.open(a.href,"_blank");
	a.download = 'tasks.txt';
}

function saveLocal(tasks){
	 if(supports_html5_storage()){
		 localStorage.removeItem("tasks");	
		 localStorage.setItem("tasks", tasks);
		 console.log("запилето");
	 }
}

function loadLocal(){
	 if(supports_html5_storage()){	
		 return localStorage.getItem("tasks");
	 }
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
    return false;
  }
}