var Processor = new function()
{
    this.Memory = new Uint8Array(4096); // Stores instructions
    this.Memory[0] = ("0x0000" & "0xFF00") >>> 8;
    this.Memory[1] = ("0x0000" & "0x00FF");
    this.Memory[2] = ("0x00E0" & "0xFF00") >>> 8;
    this.Memory[3] = ("0x00E0" & "0x00FF");
    this.Memory[4] = ("0x1000" & "0xFF00") >>> 8;
    this.Memory[5] = ("0x1000" & "0x00FF");
    this.Memory[6] = ("0x2000" & "0xFF00") >>> 8;
    this.Memory[7] = ("0x2000" & "0x00FF");
    this.Memory[8] = ("0x3000" & "0xFF00") >>> 8; // SkipNextInstruction_VxEQkk
    this.Memory[9] = ("0x3000" & "0x00FF");

    this.Memory[48] = ("0xE000" & "0xF000") >>> 8; // SkipNextInstruction_KeyDown
    this.Memory[49] = ("0x009E" & "0x00FF");
    this.Memory[50] = ("0xE000" & "0xF000") >>> 8; // SkipNextInstruction_KeyUp
    this.Memory[51] = ("0x00A1" & "0x00FF");

    this.Memory[52] = ("0xF000" & "0xF000") >>> 8; // SetVxtoDT
    this.Memory[53] = ("0x0007" & "0x00FF");
    this.Memory[54] = ("0xF000" & "0xF000") >>> 8; // WaitSetVxtoKeyDown
    this.Memory[55] = ("0x000A" & "0x00FF");
    this.Memory[56] = ("0xF000" & "0xF000") >>> 8; // SetDelayTimer_VxTODT
    this.Memory[57] = ("0x0015" & "0x00FF");
    this.Memory[58] = ("0xF000" & "0xF000") >>> 8; // SetSoundTimer
    this.Memory[59] = ("0x0018" & "0x00FF");
    this.Memory[60] = ("0xF000" & "0xF000") >>> 8; // AddVxIStore
    this.Memory[61] = ("0x001E" & "0x00FF");
    this.Memory[62] = ("0xF000" & "0xF000") >>> 8; // SetSpriteLocation
    this.Memory[63] = ("0x0029" & "0x00FF");
    this.Memory[64] = ("0xF000" & "0xF000") >>> 8; // StoreBCDRepVx
    this.Memory[65] = ("0x0033" & "0x00FF");
    this.Memory[66] = ("0xF000" & "0xF000") >>> 8; // StoreV0VxtoMemory
    this.Memory[67] = ("0x0055" & "0x00FF");
    this.Memory[68] = ("0xF000" & "0xF000") >>> 8; // ReadMemoryWriteV0Vx
    this.Memory[69] = ("0x0065" & "0x00FF");

    this.Registers = new Uint8Array(16);
    this.ISpecial; // Index register (a special register used to store a memory address)
    this.Stack = new Uint16Array(16);
    this.KeyboardBuffer = [];

    this.display_width = 64; // Display data
    this.display_height = 32;
    this.display = new Array(this.display_width * this.display_height); // JUST USE ARRAY = []. MUCH EASIER
    console.log("Display Length: " + this.display.length);

    this.delayTimer = 0;
    this.soundTimer = 0;
    this.PC = 0; // Program counter

	this.opcodeDone = false; // Tracks whether the current opcode is done executing
    this.pause = false;

    this.init = function() // Resets variables
    {
        this.Registers[0] = 180;
        this.Registers[1] = 6;
        this.ISpecial = 100;

        // Loads the fontset into the memory
        for(i = 0; i < fontset.length; i++)
        {
            this.Memory[70 + i] = fontset[i];
        }
        this.clear_display();
    };

    this.fetch = function() // Fetches from the program stored in the memory
    {
    	this.opcodeDone = false;
        console.log("Fetch!");
    };

    this.execute = function(opcode) // Finds ("reads") and executes
    {
        for (var i = 0; i < 512; i += 2) // Traverses over memory locations 0 to 511 (0x01FF)
        {
            if ((opcode & "0xF000") >>> 8 == this.Memory[i]) // Finds a match
            {
                if (i == 8) // SkipNextInstruction_VxEQkk
                //if (this.Memory[i] == 48) // SkipNextInstruction_VxEQkk
                {
                    if (this.Registers[(opcode & "0x0F00") >>> 8] == (opcode & "0x00FF"))
                    {
                        this.PC += 2;
                    }
                    break;
                }

                else if (i >= 48 && i <= 51) // 0xE000 opcodes
                {
                    if ((opcode & "0x00FF") == this.Memory[i + 1])
                    {
                        if (i == 48) // SkipNextInstruction_KeyDown
                        {
                            var hexCode = this.Registers[(opcode & "0x0F00") >>> 8];
                            var convertHex = function(code) // Converts a hexadecimal into a keyboard input
                            {
                                var key_code =
                                [
                                    49, 50, 51, 52, 81, 87,
                                    69, 82, 65, 83, 68, 70,
                                    90, 88, 67, 86
                                ];
                                for(i = 0; i < 16; i++)
                                {
                                    if(code == i)
                                    {
                                        return(key_code[i]);
                                    }
                                }
                            };

                            var key = convertHex(hexCode);
                            if (this.KeyboardBuffer[0] == key)
                            {
                                this.PC += 2;
                                console.log("This KeyDown stuff works!");
                            }
                            break;
                        }
                        else if (i == 50) // SkipNextInstruction_KeyUp
                        {
                            var hexCode = this.Registers[(opcode & "0x0F00") >>> 8];
                            var convertHex = function(code) // Converts a hexadecimal into a keyboard input
                            {
                                var key_code =
                                [
                                    49, 50, 51, 52, 81, 87,
                                    69, 82, 65, 83, 68, 70,
                                    90, 88, 67, 86
                                ];
                                for(i = 0; i < 16; i++)
                                {
                                    if(code == i)
                                    {
                                        return(key_code[i]);
                                    }
                                }
                            };

                            var key = convertHex(hexCode);
                            if (this.KeyboardBuffer[0] != key)
                            {
                                this.PC += 2;
                                console.log("This KeyUp stuff works!");
                            }
                            break;
                        }
                    }
                    else
                    {
                    	continue;
                    }
                }

                else if (i >= 52 && i <= 69) // 0xF000 opcodes
                {
                    if ((opcode & "0x00FF") == this.Memory[i + 1])
                    {
                        if (i == 52) //SetVxtoDT
                        {
                            this.Registers[(opcode & "0x0F00") >>> 8] = this.delayTimer;
                            console.log("V" + ((opcode & "0x0F00") >>> 8) + ": " + this.Registers[(opcode & "0x0F00") >>> 8]);
                            break;
                        }
                        else if (i == 54) // WaitSetVxtoKeyDown
                        {
                            this.pause = true;

                            var valid = true; // Checks for valid keys
                            var _this = this;
                            document.onkeydown = function(key) // Is this necessary?
                            {
                                var hex;
                                for(i = 0; i < 16; i++)
                                {
                                    var keys = [1, 2, 3, 4,
                                        "Q", "W", "E", "R",
                                        "A", "S", "D", "F",
                                        "Z", "X", "C", "V"];
                                    var key_code = [49, 50, 51, 52,
                                        81, 87, 69, 82,
                                        65, 83, 68, 70,
                                        90, 88, 67, 86];
                                    if(key.keyCode == key_code[i])
                                    {
                                        valid = true;
                                        hex = i;
                                        console.log(keys[i] + " is pressed!")
                                        break;
                                    }
                                    else
                                    {
                                        valid = false; // An invalid key is pressed.
                                    }
                                }

                                if (valid) // A valid key is pressed.
                                {
                                    _this.pause = false;
                                    _this.Registers[((opcode & "0x0F00") >>> 8)] = hex;
                                    if (_this.KeyboardBuffer.length == 0)
                                    {
                                        _this.KeyboardBuffer.push(key.keyCode);
                                    }
                                    document.onkeydown = null;
                                }
                            };
                            break;
                        }
                        else if (i == 56) //SetDelayTimer_VxTODT
                        {
                            this.delayTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                        else if (i == 58) //SetSoundTimer_VxTOST
                        {
                            this.soundTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                        else if(i == 60) // AddVxIStore
                        {
                        	var Vx = this.Registers[((opcode & "0x0F00") >>> 8)];
                            var VI = this.ISpecial;
                            this.ISpecial = VI + Vx;
                            console.log("VI: " + this.ISpecial);
                            break;
                        }
                        else if (i == 64) // StoreBCDRepVx
                        {
                            if (this.ISpecial >= 0 && this.ISpecial <= 511)
                            {
                                console.log("ERROR! ERROR! I refers to a locked location in memory.");
                            }
                            else
                            {
                                var Vx = this.Registers[((opcode & "0x0F00") >>> 8)];
                                Vx = Math.floor(Vx / 100);
                                this.Memory[this.ISpecial] = Vx;
                                Vx = this.Registers[((opcode & "0x0F00") >>> 8)];
                                Vx = Math.floor((Vx % 100) / 10);
                                this.Memory[this.ISpecial + 1] = Vx;
                                Vx = this.Registers[((opcode & "0x0F00") >>> 8)];
                                Vx = Math.floor((Vx % 10) / 1);
                                this.Memory[this.ISpecial + 2] = Vx;
                                console.log("Memory[" + this.ISpecial + "]: " + this.Memory[this.ISpecial]);
                                console.log("Memory[" + (this.ISpecial + 1) + "]: " + this.Memory[this.ISpecial + 1]);
                                console.log("Memory[" + (this.ISpecial + 2) + "]: " + this.Memory[this.ISpecial + 2]);
                            }
                            break;
                        }
                        else if (i == 66) // StoreV0VxtoMemory
                        {
                            for (i = 0; i <= (opcode & "0x0F00") >>> 8; i++)
                            {
                                this.Memory[this.ISpecial + i] = this.Registers[i];
                                console.log("Memory[" + (this.ISpecial + i) + "]: " + this.Memory[this.ISpecial + i]);
                            }
                            this.ISpecial += ((opcode & "0x0F00") >>> 8) + 1;
                            console.log("VI: " + this.ISpecial);
                            break;
                        }
                    }
                    else
                    {
                        continue;
                    }
                }
            }
        }
        this.opcodeDone = true;
    }

    this.TickTimers = function() // The timers will decrease by one at a rate of 60Hz.
    {
        if (this.delayTimer > 0)
        {
            this.delayTimer--;
        }
        if (this.soundTimer > 0)
        {
            this.soundTimer--;
        }
        if (this.soundTimer == 0) // Plays a tone when the sound timer reaches 0
        {

        }
        //console.log("DT: " + this.delayTimer);
    };

    this.display_test = function(test_opcode) //DXYN opcode implementation
    {
        var x_position = (test_opcode & 0x0F00) >> 8; // it really should be this.Registers[(test_opcode & 0x0F00) >> 8]; I didnt use this because it is easier to test
        var y_position = (test_opcode & 0x00F0) >> 4; // it really should be this.Registers[(test_opcode & 0x00F0) >> 4]; I didnt use this because it is easier to test
        var N = (test_opcode & 0x000F);
        this.Registers[0xF] = 0; // MAYBE JUST USE NORMAL NUMBERS

        for (display_y = 0; display_y < N; display_y++)
        {
            var line = this.Memory[this.ISpecial + display_y]; // Just reads the special I register
            for(display_x = 0; display_x < 8; display_x++)
            {
                var pixel = line & (0x80 >> display_x);
                if(pixel != 0)
                {
                    var x_total = x_position + display_x;
                    var y_total = y_position + display_y;
                    var index = y_total * 64 + x_total;
                    if(this.display[index] == 1)
                    {
                        this.Registers[0xF] = 1;
                    }
                    this.display[index] ^= 1;
                }
            }
        }

        this.PC += 2; // WHY INCREASE PC?
        console.log("Display test completed!");
    }
    this.sprite_loc = function(test_opcode) //FX29 implementation
    {
        //Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
        var sprite_value = this.Registers[(test_opcode & 0x0F00) >> 8];
        this.ISpecial = 70 + (sprite_value * 5 );
        console.log("the fontset is:" + sprite_value + "|" +"the fontset location is:" + this.ISpecial);
        this.PC += 2;     
    }
    this.clear_display = function() //00E0 opcode implementation 
    {
        for (i = 0; i < this.display.length; i++)
        {
            this.display[i] = 0;
        }
    }
    this.get_display_width = function() // Get display methods
    {
        return this.display_width;
    }

    this.get_display_height = function()
    {
        return this.display_height;
    }

    this.get_display = function()
    {
        return this.display;
    }

    this.main = function()
    {
        var _this = this;

        setInterval(function()
        {
            if (!_this.pause)
            {
                _this.TickTimers();

                window.onkeydown = function(event)
                {
                    if (_this.KeyboardBuffer.length == 0)
                    {
                        _this.KeyboardBuffer.push(event.keyCode);
                    }
                    window.onkeydown = null;
                }
            }

            window.onkeyup = function(event)
            {
                if (_this.KeyboardBuffer.length != 0)
                {
                    if (_this.KeyboardBuffer[0] == event.keyCode)
                    {
                        _this.KeyboardBuffer.shift();
                        if(!_this.pause)
                        {
                        	console.log("Removed a key from the array!");
                        }
                    }
                }
                window.onkeyup = null;
            };

           	if (!_this.pause && _this.opcodeDone)
            {
                _this.fetch();
            }

            /*document.addEventListener("keydown", function(event)
            {
                _this.KeyboardBuffer.push(event);
                if (_this.KeyboardBuffer.length == 0);
                {
                    if (event.keyCode == 65)
                    {
                    }
                }
            });*/
        }, 16.6667); // Each cycle in the emulator lasts for 16.66 ms.
    };
}