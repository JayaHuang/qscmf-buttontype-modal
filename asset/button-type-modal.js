
function renderQsButtonModalBodyContent(modalDom, apiUrl) {
    let infoDom = modalDom.find('.modal-body .button-modal-body-info');
    modalDom.find('.preloader').removeClass('hidden');
    infoDom.html('');

    // $.get(apiUrl, function (res) {
    //     if (res.status === 1) {
    //         $('.preloader').addClass('hidden');
    //         infoDom.html(res.info || '');
    //         injectSubmitTargetFormClass(modalDom);
    //     }
    //     if (res.status === 0){
    //         alert(res.info || '错误');
    //         $('#{$gid}QsButtonModal').modal('hide');
    //     }
    // });

    ajaxPromise(apiUrl).then(function(res){
        modalDom.find('.preloader').addClass('hidden');
        var mainDom = $("<div>" + res.info + "</div>");
        var scriptSrcDom = mainDom.find('script[src]');

        return loadedPromise(scriptSrcDom, infoDom, mainDom);
    }).then(function(dom){
        infoDom.html(dom.html());
        injectSubmitTargetFormClass(modalDom);
    }).catch(function(res){
        console.log(res);
        alert(res.info || '错误，请联系管理员');
        modalDom.modal('hide');
    });
}

function loadedPromise(scripts, infoDom, mainDom){
    return new Promise((resolve, reject) =>{
        var len = scripts.length;
        var count = 0;

        for(var i=0; i<scripts.length; i++){
            var scriptDom = document.createElement("script");
            scriptDom.onload = function(){
                count++;
                if(count === len){
                    resolve(mainDom);
                }
            }
            scriptDom.src = scripts[i].src;
            scripts[i].remove();
            document.body.append(scriptDom);
        }
    });
}

function ajaxPromise(apiUrl){
    return new Promise(function(resolve, reject){
        $.get(apiUrl, function (res) {
            if (res.status === 1) {
                resolve(res);
            }
            if (res.status === 0){
                reject(res);
            }
        });
    });
}

function injectSubmitTargetFormClass(modalDom){
    let submitDom = modalDom.find('.modal-footer .submitModal');
    let modalFormDom = modalDom.find('.modal-body form');
    if (submitDom && modalFormDom){
        modalFormDom.addClass(submitDom.attr('target-form'));
    }
}

function injectCheckedIds(modalFormDom, name){
    let selectIds = $(".builder .check-all").data("checkedIds") || "";
    let class_name = 'qsbl-modal-'+name;

    let checkedIdsDom = modalFormDom.find("."+class_name);
    if (checkedIdsDom.length === 0){
        let selectIdsDom= document.createElement("input");
        selectIdsDom.setAttribute("type","hidden");
        selectIdsDom.setAttribute("name", name);
        selectIdsDom.setAttribute("class", class_name);
        selectIdsDom.setAttribute("value", selectIds);

        modalFormDom[0].appendChild(selectIdsDom);
    }else{
        checkedIdsDom.val(selectIds);
    }
}

function resetModalCss(name, value, dom) {
    dom.css(name, value);
}

function moveToBodyBottom(domId){
    document.body.appendChild(copyDom(domId));
    removeDom(domId)
}

function copyDom(domId){
    let oldDom = document.getElementById(domId);
    return oldDom.cloneNode(true);
}

function removeDom(domId){
    let self = document.getElementById(domId);
    let parent = self.parentElement;
    let removed = parent.removeChild(self);
    return removed === self;
}

$(document).on('show.bs.modal', '.modal', function(event) {
    let modalZIndex = calModalZIndex();
    $('body').find(".modal-backdrop:last").css("z-index", modalZIndex);
    $(this).css("z-index", modalZIndex + 1);
}).on('hide.bs.modal', '.modal', function(event) {
    let modalZIndex = calModalZIndex();
    $(this).css("z-index", modalZIndex);
    $('body').find(".modal-backdrop:last").css("z-index", modalZIndex-1);
}).on('hidden.bs.modal', '.modal', function(event) {
    let modalZIndex = calModalZIndex();
    $('body').find(".modal-backdrop:last").css("z-index", modalZIndex-1);
});

function calModalZIndex(){
    let modalDefZIndex = 1040;
    let showModalCount =  $('.modal:visible').length;
    if (showModalCount > 0){
        modalDefZIndex = modalDefZIndex + showModalCount;
    }
    return  modalDefZIndex;
}