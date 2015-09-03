$(function(){
  
  // var
  var imgWidth, imgHeight, img, enhanceInterval, fadeInterval;
  
  // dom
  var $canvas = $('#image');
  var ctx = $canvas[0].getContext('2d');
  var $upload = $('#image-upload');
  var $save = $('#image-save input');
  var $size = $('#pixel-size');
  var $enhance = $('#image-enhance input');
  var $fade = $('#image-fade input');
  
  // helpers
  var getAverageRGB = function(imgData) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var total = 0;
    
    for ( var i = 0; i < imgData.length; i += 4 ) {
      if ( imgData[i+3] !== 0 ) {
        red += imgData[i+0];
        green += imgData[i+1];
        blue += imgData[i+2];
        total++;
      }
    }
    
    var avgRed = Math.floor(red/total);
    var avgGreen = Math.floor(green/total);
    var avgBlue = Math.floor(blue/total);
    
    return 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ', 1)';
  };
  
  var pixelatize = function(size) {
    for ( var x = 0; x < imgWidth; x += size ) {
      for ( var y = 0; y < imgHeight; y += size ) {
        var pixels = ctx.getImageData(x, y, size, size);
        var averageRGBA = getAverageRGB(pixels.data);
        ctx.fillStyle = averageRGBA;
        ctx.fillRect(x, y, size, size);
      }
    }
  };
  
  // events
  $upload.change(function(e){
    img = new Image();
    img.onload = function() {
      imgWidth = img.width;
      imgHeight = img.height;
      $canvas.attr('width', imgWidth);
      $canvas.attr('height', imgHeight);
      ctx.drawImage(img,0,0);
      pixelatize(parseInt($size.val()));
      $('.hidden').removeClass('hidden');
    };
    
    img.src = URL.createObjectURL(e.target.files[0]);
  });
  
  $size.change(function(e){
    ctx.drawImage(img,0,0);
    pixelatize(parseInt($(this).val()));
  });
  
  $enhance.click(function(){
    clearInterval(fadeInterval);
    var enhance = function(){
      var size = parseInt($size.val()) - 1;

      if ( size === 0) {
        clearInterval(enhanceInterval);
      }
      else {
        $size.val(size);
        ctx.drawImage(img,0,0);
        pixelatize(size);
      }
    };
    
    enhanceInterval = setInterval(enhance, 100);   
  });
  
  $fade.click(function() {
    clearInterval(enhanceInterval);
    var enhance = function(){
      var size = parseInt($size.val()) + 1;

      if ( size > img.width/2) {
        clearInterval(fadeInterval);
      }
      else {
        $size.val(size);
        pixelatize(size);
      }
    };
    
    fadeInterval = setInterval(enhance, 100);   
  });
  
  $save.click(function(){
    var savedPNG = $canvas[0].toDataURL("image/png");
		window.open(savedPNG,'_blank');
  });
  
});