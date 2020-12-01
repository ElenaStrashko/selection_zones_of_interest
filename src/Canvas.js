import React, {useEffect, useRef} from 'react';
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) => ({
    canvas: {
        margin: 20,
        width: 660,
        height: 330,
        display: "block",
        border: "2px solid gray",
        padding: "5px",
    },
    buttons: {
        position: "relative",
        padding: 5,
    },
    image: {
    position: "relative",
    left: "10px",
    border: "1px solid gray"
    }
}));


function draw(ctx, point, index, arr){
    ctx.arc(point.x - 27, point.y - 75, 2, 0, 2 * Math.PI);
    ctx.fill();
    if (index === 0) {
        ctx.moveTo(point.x - 27, point.y - 75);
    }
    else if (index !== arr.length - 1) {
        ctx.lineTo(arr[index + 1].x - 27, arr[index + 1].y - 75);
    }
}


function choose_color(color, ctx) {
    if (color.getItem("color") === "red") {
        ctx.strokeStyle = "rgba(255,0,0,0.5)";
        ctx.fillStyle = "rgba(255,0,0,0.5)";
    }
    else {
       ctx.strokeStyle = "rgba(255,255,0,0.5)";
       ctx.fillStyle = "rgba(255,255,0,0.5)";
    }
}


function draw_contours(ctx, locations, contours, color) {

    if (contours.length === 0) {
        ctx.beginPath();
        choose_color(color, ctx);
        locations.forEach((point, index, arr) => {
            draw(ctx, point, index, arr);
        });
        ctx.closePath();
    }
    else {

        console.log("CONTOURS FROM DRAW", contours);
        let keys = Object.keys(contours);
        console.log(keys);
        choose_color(color, ctx);

        for(let key of keys) {
            ctx.beginPath();
            console.log(contours.getItem(key));
            let arr = JSON.parse(contours.getItem(key));

             if (key.includes("red")) {
                ctx.strokeStyle = "rgba(255,0,0,0.5)";
                ctx.fillStyle = "rgba(255,0,0,0.5)";
            }
            else {
                ctx.strokeStyle = "rgba(255,255,0,0.5)";
                ctx.fillStyle = "rgba(255,255,0,0.5)";
            }

            arr.forEach((point, index, arr) => {
                draw(ctx, point, index, arr);
            });
            ctx.closePath();
        }

        if (locations.length !== 0) {
            ctx.beginPath();
            console.log(locations);
            choose_color(color, ctx);
            locations.forEach((point, index, arr) => {
                draw(ctx, point, index, arr);
            });
            ctx.closePath();
        }
    }
}


export default function Canvas() {
    const classes = useStyles();
    const [locations, setLocations] = React.useState([]);
    const canvasRef = React.useRef(null);
    const imageRef = React.useRef(null);

    let Points = [];

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        const img = imageRef.current;
        ctx.drawImage(img, 0, 0, 320, 240);

        draw_contours(ctx, locations, localStorage, sessionStorage);
        Points = locations;

        console.log("POINTS",Points);
    });

    function handleCanvasClick(e) {
        const newLocation = { x: e.clientX, y: e.clientY };
        setLocations([...locations, newLocation]);
    }


    function handleClear() {
        setLocations([]);
        Points = [];
        localStorage.clear();
        sessionStorage.clear()
    }


    function makeRequest() {
        let httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        httpRequest.open('POST', '/');

        let color = "";
        if (sessionStorage.getItem("color") === "red") {
            color = "red"
        }
        else {
            color = "yellow"
        }
        localStorage.setItem(color + "_" + (localStorage.length +1).toString(), JSON.stringify(Points));

        let data = JSON.stringify(localStorage);
        httpRequest.send(data);

        localStorage.clear();
        sessionStorage.clear();
        setLocations([]);

        alert("Your contours were saved to the computer")
    }


    function addContour(){
        let color = "";
        if (sessionStorage.getItem("color") === "red") {
            color = "red"
        }
        else {
            color = "yellow"
        }
        localStorage.setItem(color + "_" + (localStorage.length +1).toString(), JSON.stringify(Points));

        Points = [];
        setLocations([]);
    }


    function undoAction() {
        Points.pop();
        setLocations([...locations]);
    }

    function addRed() {
        sessionStorage.clear();
        sessionStorage.setItem("color", "red")
    }

    function addYellow() {
        sessionStorage.clear();
        sessionStorage.setItem("color", "yellow")
    }


  return (
      <div className={classes.canvas}>
          <canvas
              ref={canvasRef}
              width={320}
              height={240}
              onClick={handleCanvasClick}
              style={{border: "1px solid gray"}}
          />

          <img ref={imageRef} src="./video_feed" width={320} height={240} className={classes.image}/>

          <div className={classes.buttons}>
              <Button onClick={handleClear} variant="contained" color="primary" size={"small"}>
                  Clear
              </Button>
              <Button onClick={makeRequest} variant="contained" color="primary" size={"small"}>
                  Save points
              </Button>
              <Button onClick={addContour} variant="contained" color="primary" size={"small"}>
                  Add new contour
              </Button>
              <Button onClick={undoAction} variant="contained" color="primary" size={"small"}>
                  Undo last action
              </Button>
              <Button onClick={addRed} variant="contained" color="primary" size={"small"}>
                  Red
              </Button>
              <Button onClick={addYellow} variant="contained" color="primary" size={"small"}>
                  Yellow
              </Button>
          </div>
      </div>
  )
}
