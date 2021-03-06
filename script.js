let video= document.querySelector("video");
    //   let startBtn= document.querySelector("#start");
    //   let stopBtn= document.querySelector("#stop");
    let recordBtn= document.querySelector("#record");
    let recDiv=recordBtn.querySelector("div")
      let capBtn= document.querySelector("#capture")  
      let capDiv=capBtn.querySelector("div");
      let body = document.querySelector("body");


      let mediaRecorder;
      let isRecording= false;
      let chunks=[];
      let appliedFilter;

      let minZoom = 1;
      let maxZoom = 3;

      let filters = document.querySelectorAll(".filter");//fiter select krne ke liye

      let zoomInBtn = document.querySelector(".zoom-in");///btn bna liye
      let zoomOutBtn = document.querySelector(".zoom-out");
      let currZoom = 1;

      let galleryBtn = document.querySelector("#gallery");

      galleryBtn.addEventListener("click", function () {
        // localhost:5500/index.html => localhost:5500/gallery.html
        location.assign("gallery.html");
      });
      
      zoomInBtn.addEventListener("click", function () {
        if (currZoom < maxZoom) {
          currZoom = currZoom + 0.1;//inc krre
        }
      
        video.style.transform = `scale(${currZoom})`;//trafom ka scale ininially 1 hai aur zoom krne ke liye curr ki vaue lera hai
      });
      
      zoomOutBtn.addEventListener("click", function () {
        if (currZoom > minZoom) {
          currZoom = currZoom - 0.1;// dec krre
        }
        video.style.transform = `scale(${currZoom})`;
      });

      for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", function (e) {
          removeFilter();
          appliedFilter = e.currentTarget.style.backgroundColor;
          console.log(appliedFilter);
      
          let div = document.createElement("div");
          div.style.backgroundColor = appliedFilter;
          div.classList.add("filter-div");
          body.append(div);
        });
      }

      recordBtn.addEventListener("click",function(e){
        if(isRecording){
            mediaRecorder.stop()
            isRecording=false
            recDiv.classList.remove("record-animation") 
           }else{
            mediaRecorder.start()
            appliedFilter = ""; //color remove
            removeFilter(); //ui se remove
            currZoom = 1;
           video.style.transform = `scale(${currZoom})`;
           isRecording=true
            recDiv.classList.add("record-animation") 

        }
      })

    //   startBtn.addEventListener("click",function(){
    //       //code jissw recoding hogi
    //       mediaRecorder.start();
    //   });
    //   stopBtn.addEventListener("click",function(){
    //       //code jissw recoding band hogi
    //       mediaRecorder.stop();//object m 2 events h mic an caamera
    //   });
      capBtn.addEventListener("click",function(){

        if (isRecording) return;

        capDiv.classList.add("capture-animation")
        setTimeout(function() {
            capDiv.classList.remove("capture-animation")
        }, 1000);
        //jobi image screen pe dikhra usse save krlo
        let canvas = document.createElement("canvas");
        canvas.width=video.videoWidth;
        canvas.height=video.videoHeight;
        let tool= canvas.getContext("2d");

        tool.translate(canvas.width / 2, canvas.height / 2);//CANVAS KE SCALE KO VDO KE CENTRE PE LERE HAI 

         tool.scale(currZoom, currZoom);//CAP KE PASS BI AB CURR ZOOM KI VALUE HAI

         tool.translate(-canvas.width / 2, -canvas.height / 2);//VAPIS CANVAS KO USKI ORIGAL PLACE PE SHIFT KRRE HAI

        tool.drawImage(video,0,0)   ;//AB ZOOM KO DRAW KRRE HAI
        
        if (appliedFilter) {//captured photo pe filter aaera
            tool.fillStyle = appliedFilter;
            tool.fillRect(0, 0, canvas.width, canvas.height);
          }

        ///dowmload the imge
        let link=canvas.toDataURL();
        addMedia(link, "image");

        // let a=document.createElement("a");
        // a.href=link;
        // a.download="img.png";
        // a.click();
        // a.remove();
        // canvas.remove();
      });
        navigator.mediaDevices
        .getUserMedia({video: true, audio: true})
        .then(function(mediaStream){//media stream is an object whch has camera and mic ip

            mediaRecorder=new MediaRecorder(mediaStream)//media recorder is a blueprint
            
            mediaRecorder.addEventListener("dataavailable",function(e){
                chunks.push(e.data)
            });

            mediaRecorder.addEventListener("stop",function(e){
                let blob =new Blob(chunks, {type:"video/mp4"});// blob inbuild func which helps in converting chunks to video 
                chunks=[]//chunks ko empty krdo
                addMedia(blob, "video");

                // let a=document.createElement("a")
                // let url=window.URL.createObjectURL(blob)
                // a.href=url;
                // a.download = "video.webm";
                // a.click()
                // a.remove()
            }); 

            video.srcObject= mediaStream;
        })
        .catch(function(err){
            console.log(err);
        });

        function removeFilter() {
            let Filter = document.querySelector(".filter-div");
            if (Filter) Filter.remove();
          }//purani div ie filter ko remove krega
            
        