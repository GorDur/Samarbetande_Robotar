let zoom_value;
window.addEventListener('load', f => {
    // var coll = document.getElementsByClassName("collapsible");
    // var i;

    // for (i = 0; i < coll.length; i++) {
    //     coll[i].addEventListener("click", function() {
    //         this.classList.toggle("active");
    //         var content = this.nextElementSibling;
    //         if (content.style.maxHeight){
    //             content.style.maxHeight = null;
    //         } else {
    //         content.style.maxHeight = content.scrollHeight + "px";
    //         } 
    //     });
    // }
    
    const slider = document.querySelector('#Map');
    const dupe = document.querySelector('#array')
    let isDown = false;
        let startX;
        let scrollLeft;
        let startY;
        let scrollTop;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startY = e.pageY - slider.offsetTop;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            scrollTop = slider.scrollTop;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const y = e.pageY -slider.offsetTop;
            const walky = (y-startY)*3/zoom_value;
            const x = e.pageX - slider.offsetLeft;
            const walkx = (x - startX) * 3/zoom_value; //scroll-fast
            slider.scrollTop = scrollTop-walky;
            slider.scrollLeft = scrollLeft - walkx;
            dupe.scrollTop = scrollTop-walky;
            dupe.scrollLeft = scrollLeft-walkx;
        });
    function eventHandler(event){
        var pre_zoom = parseFloat(window.getComputedStyle(this).zoom)
        var zoom = 0.1;

        if(event.wheelDelta > 0){
            zoom_value = Math.min(1,pre_zoom + zoom) ;
        }
        else{
            zoom_value = Math.max(0.2,pre_zoom - zoom);
        }
        this.style.zoom = zoom_value
        this.style.height= window.innerHeight/zoom_value +'px'
        document.getElementById('array').style.zoom = zoom_value
        document.getElementById('array').style.height= window.innerHeight/zoom_value +'px'
        event.preventDefault();
    }

    var body = document.getElementById('Map');
    body.addEventListener('mousewheel',eventHandler,false);

},false);
