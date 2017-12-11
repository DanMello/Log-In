var canvas = document.getElementById('canvas')
let image = document.getElementById('image')

canvas.width = 400
canvas.height = 400

let pictureWidthRatio = canvas.width / image.width
let pictureHeightRatio = canvas.height / image.height
let ratio  = Math.min (pictureWidthRatio, pictureHeightRatio)
let centerShift_x = ( canvas.width - image.width*ratio ) / 2
let centerShift_y = ( canvas.height - image.height*ratio ) / 2

var ctx = canvas.getContext('2d')

ctx.transform(0, 1, -1, 0, image.height, 0)

// ctx.translate(200 ,200)
// ctx.rotate(90*Math.PI/180)
ctx.drawImage(image, 0,0, image.width, image.height,
                    centerShift_x,centerShift_y,image.width*ratio, image.height*ratio)


    // let canvas = document.createElement("canvas")

    // canvas.width = parseInt(container.style.width, 10)
    // canvas.height = parseInt(container.style.height, 10)

    // let pictureWidthRatio = canvas.width / img.width
    // let pictureHeightRatio = canvas.height / img.height
    // let ratio  = Math.min (pictureWidthRatio, pictureHeightRatio)
    // let centerShift_x = ( canvas.width - img.width*ratio ) / 2
    // let centerShift_y = ( canvas.height - img.height*ratio ) / 2

    // let ctx = canvas.getContext("2d")

    // img.onload = function () {

    //   if (orientation === 6) {

    //     ctx.transform(0, 1, -1, 0, 400, 0)
    //   }

    //   ctx.drawImage(img, 0,0, img.width, img.height,
    //                 centerShift_x,centerShift_y,img.width*ratio, img.height*ratio)
    // }