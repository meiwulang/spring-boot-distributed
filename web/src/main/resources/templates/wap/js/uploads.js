 document.getElementById('submit').onclick = function(event){
        if(event.preventDefault){//取消按钮默认提交行为
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        var formDOM = document.getElementsByTagName('form')[0];
        var formData = new FormData(formDOM);//创建formData对象
        var req = new XMLHttpRequest();
        req.open("POST", "http://zsl.jd.ziyo.ren/b2b/upload/picture?XDEBUG_SESSION_START=LIUXINGWEI");//使用POST发送请求
        req.onload = function(event){
            if(this.status === 200){
                // console.log(this.response);//请求成功后打印返回的结果
            }
        }
        req.send(formData);
        req = null;
    }