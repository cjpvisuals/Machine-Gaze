let capture
let tracker
let balls = []
let stars = []

function setup() {

    createCanvas(800, 600).parent('p5')
    // start capturing video
    capture = createCapture(VIDEO)
    capture.size(800, 600)
    capture.hide()

    // create the tracker
    tracker = new clm.tracker()
    tracker.init()
    tracker.start(capture.elt)

    for (let i=0; i<200; i++) {
        let new_star = {    x: random(width),
                            y: random(height),
                            vx: random(-2, 2),
                            vy: random(-2, 2),
                            radius: random(10),
                            radius_v: 1
                        }
        stars.push(new_star)
      }

}

function draw() {
    // draw background stuff
    background(0, 0, 0, 20)

    // show the mirrored video feed
    showFlippedCapture()

    // get new data from tracker
    let features = tracker.getCurrentPosition()

    for (let star of stars){
      noStroke()
      fill(255)
      drawStar(star.x, star.y, star.radius, 3, 5)


    if (mouseIsPressed && features.length) {
            // find the index of this star in the stars array
            let index = stars.indexOf(star)

            index = floor((index / stars.length) * features.length)
            // get the feature
            let feature = features[index]

            star.x += (feature.x - star.x) / 10
            star.y += (feature.y - star.y) / 10

            star.x += random(-1, 1)
            star.y += random(-1, 1)
        } else {
            star.x += star.vx
            star.y += star.vy
        }
        // wrap walls
        if (star.x < 0) {
            star.x += width
        }
        if (star.x > width) {
            star.x -= width
        }
        if (star.y < 0) {
            star.y += height
        }
        if (star.y > height) {
            star.y -= height
        }
        // twinkle
        star.radius -= star.radius_v
        if (star.radius < 0 || star.radius > 10) {
            star.radius_v = -star.radius_v
        }

    for (let feature of features) {
      circle (feature.x, feature.y, 5)
    }


    if (features.length == 0) {
      return
    }

    // 'features' is an array of objects with x, y properties
  //  for (let feature of features) {
    //    stroke(255)
      //  fill(255)
      //  circle(feature.x, feature.y, 4)
      //  text(feature.label, feature.x, feature.y)
    // }

      let mouth_top= features[60]
      let mouth_bottom=features[57]
      let distance = dist(mouth_top.x, mouth_top.y, mouth_bottom.x, mouth_bottom.y)

      if (distance > 10) {
        let mouth_center = { x: mouth_top.x,
                             y: (mouth_top.y + mouth_bottom.y) / 2
                          }


            let random_ball = {x: mouth_center.x,
                               y: mouth_center.y,
                               vx: random(-10,10),
                               vy: random(-10,10),
                               c: [random(255), random(255), random(255), random (200,255)]
                             }
              balls.push(random_ball)
          }

          for (let ball of balls) {

          noStroke()
          fill(ball.c)
          circle(ball.x,ball.y,20)

          ball.x += ball.vx
          ball.y += ball.vy

          ball.vy += 0.5

          if (ball.x < 0 || ball.x > width || ball.y < 0 || ball.y > width) {
            balls.splice(balls.indexOf(ball),1)
          }

        }

        for (let star of stars) {
                noStroke()
                drawStar(star.x, star.y, star.radius, 3, 5)
                star.radius -= star.radius_v
                if (star.radius < 0 || star.radius > 10) {
                    star.radius_v = -star.radius_v
                }
            }
}


function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// this function flips the webcam and displays it
function showFlippedCapture() {
    push()
    translate(capture.width, 0)
    scale(-1, 1)
    image(capture, 0, 0, capture.width, capture.height)
    pop()
}
}
