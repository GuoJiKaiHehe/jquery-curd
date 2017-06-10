$(function(){
    

    (function(){
    'use strict';
    var Task={
        items_list:[],
        showBox: function(str){
            $(".mask").fadeIn(300);
            $('.'+str+"-box").fadeIn(300)
        },
        hideBox:function(str){
          
                $(".mask").fadeOut(300);
                $('.'+str+"-box").fadeOut(300)
            
        },
        fetchData:function(data,page){
            // this.items_list;
            /**
             * 
             */
            var eachPageshow=5;
           
            var page= page? page : 1;
             var first=(page-1)*eachPageshow;
           // console.log(data);

            var items_tpl=`
                <li class="item" data-id="#index#">
                <span><input type="checkbox" value="#index#" /></span>
                <span class="item-content">
                    #content#
                </span>
               <span class="delete handler" data-id="#index#">delete</span>
                <span class="details handler" data-id="#index#">details</span>
            </li>
            `;
            var html='';
            var allData;
            console.log(data)
            if(data){
                allData=data;
            }else{
                allData=this.items_list;
            }
            console.log(allData.slice(first,page*eachPageshow))
            allData=allData.slice(first,page*eachPageshow);
            // console.log(this.items_list.length)
            for(var i=first;i<this.items_list.length;i++){
                if(i>=page*eachPageshow){
                    break;
                }
                 html+=items_tpl.replace(/#index#/g,i)
                                .replace(/#content#/g,this.items_list[i].content);
               
                
            }
          //  console.log(this.items_list)
            $('.task-list').html(html);
        },
        save:function(i){

        },
        add:function(content){
            var obj={};
            obj.content=content;
            obj.id=this.getLastId();
            this.items_list.push(obj);
            this.fetchData();
            store.set('jquery-todos',this.items_list)
            this.fetchData();
        },
        del:function(i){
           var _this=this;
            if(window.confirm("sure?")){
                  this.items_list.forEach(function(item,index){
                    if(index==i){
                        console.log(_this.items_list)
                        _this.items_list.splice(i,1);
                        store.set('jquery-todos',_this.items_list)
                    }
                })  
                this.fetchData();
            }
            
        },
        getLastId:function(){
           var id=this.items_list[this.items_list.length-1].id || 1; 
            
            return id;
        },
        find:function(i){
            var obj;
            this.items_list.forEach(function(item,index){
                if(index==i){
                    obj=item;
                }
            })
            return obj;
        },
        addEvent:function(){
            var _this=this;


            $(document).click(function(e){
                e.stopPropagation();
               //  alert('')
                var mask=$(".mask")[0];
                if(e.target==mask){
                   
                    _this.hideBox('detail');
                    _this.hideBox('add');
                }
            });
            $("body").on("click",".item",function(){
                if( $(this).find("input[type=checkbox]")[0].checked){
                    $(this).find("input[type=checkbox]")[0].checked=false;
                }else{
                   $(this).find("input[type=checkbox]")[0].checked=true;
                }
              
            })
            $("#add").click(function(){
                // alert(66)
                  _this.showBox('add');
                  var addbox=$('.add-box');

                  addbox.find('.btn').click(function(){
                    var content=addbox.find("textarea").val();
                     _this.add(content);
                     addbox.find("textarea").val('');
                  });
            }),
            $("body").on("click",".delete",function(){
                var id=$(this).attr("data-id");
                _this.del(id);
            })
             $("body").on("click",".details",function(){
               
                var id=$(this).attr("data-id");
                var item=_this.find(id);
                if(item){
                   _this.showBox('detail');
                   var detailbox=$(".detail-box");

                   detailbox.find(".content").val(item.content);
                   detailbox.find(".btn").click(function(){
                        item.content=detailbox.find(".content").val();
                        _this.fetchData();
                   })
                }

            });
             $(".search-btn").click(function(){
                var keyword=$(".search-text").val();
                _this.search(keyword);
             })


        },
        search:function(keyword){
            var searchArr=[];
            for(var i=0;i<this.items_list.length;i++){
           
                if(this.items_list[i].content.indexOf(keyword)!=-1){
                   var obj={};
                   obj.content =this.items_list[i].content.replace(keyword,'<em style="color:red">'+keyword+'</em>');
                   obj.date=new Date().getTime();
                    searchArr.push(obj);
                }
            }
            this.fetchData(searchArr)
        },
        init:function(){
            var _this=this;
             var items_test=[
                {content:"neirongsadfasdfasdfasdfasdfa",date:55613},
                {content:"neirongsadfasdfasdfasdfasdfa",date:55613},
                {content:"neirongsadfasdfasdfasdfasdfa",date:55613}
            ]
            this.items_list=store.get("jquery-todos") || [];
            //console.log(this.items_list)
             if(this.items_list.length<1){
                this.items_list=items_test;
            }
            this.fetchData();
            this.addEvent();  
            $("#page").initPage(this.items_list.length,1,function(page){
                // console.log(page)
                _this.fetchData(null,page);
            });
        }
    }
    Task.init();

   
   

 //   console.log(items_list)
        

    })();

});

