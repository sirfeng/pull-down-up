var drop_down = function (datas,callfn){ //下拉刷新
                var obj = document.getElementById(datas.setElement);
                var body = obj.parentNode;
                var vars = {
                    ismove:false,//是否存在下拉刷新
                    isajax:false,//是否在请求
                    setStyle:function(time,move){
                        return ';transition:all '+time+'s;-webkit-transition:all '+time+'s;transform: translate(0,'+move+'px);'
                    }
                };
                //回调需要的事件
                var fn = {
                    success:function(backfn){
                        setTimeout(function(){
                            backfn()//回调函数
                            vars.isajax = false;
                            obj.style.cssText += vars.setStyle(1,0);
                        },2000)
                    }
                }
                
                obj.addEventListener('touchstart',function(e){//开始触屏
                    var e = e?e : event;
                    if(body.scrollTop == 0 && !vars.isajax){
                        vars.startY = e.touches[0].clientY;
//                      obj.style.cssText += vars.setStyle(0,0);
                        datas.startfn();
                    }
                    
                })
                obj.addEventListener('touchmove',function(e){ //开始移动
                    var e = e?e:event;
                    vars.moveY = e.touches[0].clientY;
//                  console.log(body)
                    if(body.scrollTop <= 0 && !vars.isajax){//当父级的滚动高度为0且没有请求执行
                        if(vars.moveY > vars.startY && vars.startY != 0){//当向下滑才执行
                            datas.movefn({startY:vars.startY,moveY:vars.moveY});//返回Y轴坐标
                            vars.moveH = vars.moveY - vars.startY;
                            obj.style.cssText += vars.setStyle(0,vars.moveH/2)//-datas.setminH
                            e.preventDefault();//在下拉刷新的过程中阻止浏览器的默认行为
                            vars.ismove = true;
							console.log(vars.moveH/2+','+datas.setminH)
                            if(vars.moveH/2 > datas.setminH){
                                datas.moveMinfn();
                            }else{
                                datas.startfn();
                            }
                        }
                    };
                })
                obj.addEventListener('touchend',function(e){//离开屏幕
                    if(vars.ismove && !vars.isajax){
                        if((vars.moveY - vars.startY)/2 > datas.setminH){//下拉的够下
                            obj.style.cssText += vars.setStyle(1,datas.setminH);
                            vars.isajax = true; //下拉大于高度请求
                            datas.endfn();
                            callfn(fn)
                        }else{
                            obj.style.cssText += vars.setStyle(1,0);
                        }
                        vars.ismove = false;
                    }
                    vars.startY = 0;//离开屏幕重新设置起始值
                })
            }
            
            
            
            /*上拉加载 datas datas.setElemnt*/
            var pull_up = function(datas,callBack){
                var obj = document.getElementById(datas.setElement);
                var parentElement = obj.parentNode;
                var selfVar = {
                    isajax:false,
                    visibleH:parentElement.nodeName == "BODY"?window.innerHeight:parentElement.clientHeight,//可视高度
                    scrollTop:parentElement.scrollTop, //滚动距离
                    totalHeight : parentElement.scrollHeight, //总的高度
                }
                obj.addEventListener('touchstart',function(e){
                    var e = e?e:event;
//                  console.log(selfVar.isajax)
                    if(selfVar.totalHeight >= selfVar.scrollTop + selfVar.visibleH && selfVar.scrollTop!=0){
                        datas.startfn();
                    }
                });
                obj.addEventListener('touchmove',function(e){
                    var e = e?e:event;
                    console.log(selfVar.totalHeight +','+ selfVar.scrollTop +','+ selfVar.visibleH)
                    selfVar.totalHeight = parentElement.scrollHeight, //总的高度
                    selfVar.scrollTop = parentElement.scrollTop;
                    if(selfVar.totalHeight - datas.setminH <= selfVar.scrollTop + selfVar.visibleH && !selfVar.isajax){
                        selfVar.isajax = true;
                        callBack(fn);
                    }
                })
                var fn = {
                    success:function(){
                        selfVar.isajax = false; 
                    }
                }
            }
            