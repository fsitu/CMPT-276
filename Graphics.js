var graphics_render = function(canvas, width, height)
{
    this.canvas = canvas.getContext('2d');
    this.width = width;
    this.height = height; 

    /*this.set_canvas = function()
    {
        var canvas_id = document.getElementById('display');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);
        canvas.setAttribute('id', 'canvas');
        canvas_id.appendChild(canvas);
    }*/

    this.reset = function()
    {
    }

    this.render = function(display)
    {
        for (i = 0; i < display.length; i++)
        {
            if(display[i] == 0)
            {
                this.canvas.fillStyle = "black ";
            }
            else
            {
                this.canvas.fillStyle = "white";
            }
            x = (i % this.width);
            y = Math.floor(i / this.width);
            this.canvas.fillRect(x * 10, y * 10, 10, 10);
        }
    }
}