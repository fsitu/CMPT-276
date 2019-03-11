var Processor = new function()
{
    this.Memory = new Uint8Array(4096);
    // Stores instructions
    this.Memory[0] = ("0x0000" & "0xF000") >>> 8; // exec_subrout(), which isn't implemented
    this.Memory[1] = ("0x0000" & "0x0000");
    this.Memory[2] = ("0x00E0" & "0xFF00") >>> 8; // ClearDisplay
    this.Memory[3] = ("0x00E0" & "0x00FF");
    this.Memory[4] = ("0x00EE" & "0xFF00") >>> 8; // stack_return()
    this.Memory[5] = ("0x00EE" & "0x00FF");
    this.Memory[6] = ("0x1000" & "0xF000") >>> 8; // jp_addr()
    this.Memory[7] = ("0x1000" & "0x0000");
    this.Memory[8] = ("0x2000" & "0xF000") >>> 8; // this.call_addr()
    this.Memory[9] = ("0x2000" & "0x0000");

    this.Memory[10] = ("0x3000" & "0xF000") >>> 8; // SkipNextInstruction_VxEQkk
    this.Memory[11] = ("0x3000" & "0x0000");
    this.Memory[12] = ("0x4000" & "0xF000") >>> 8; // this.skip_inst_2()
    this.Memory[13] = ("0x0000" & "0x0000");
    this.Memory[14] = ("0x5000" & "0xF000") >>> 8; // this.skip_inst_3()
    this.Memory[15] = ("0x0000" & "0x000F");
    this.Memory[16] = ("0x6000" & "0xF000") >>> 8; // this.LD_1()
    this.Memory[17] = ("0x0000" & "0x0000");
    this.Memory[18] = ("0x7000" & "0xF000") >>> 8; // this.ADD()
    this.Memory[19] = ("0x0000" & "0x0000");

    this.Memory[20] = ("0x8000" & "0xF000") >>> 8; // this.LD_2()
    this.Memory[21] = ("0x0000" & "0x000F");
    this.Memory[22] = ("0x8000" & "0xF000") >>> 8; // this.OR_1()
    this.Memory[23] = ("0x0001" & "0x000F");
    this.Memory[24] = ("0x8000" & "0xF000") >>> 8; // this.AND_XY()
    this.Memory[25] = ("0x0002" & "0x000F");
    this.Memory[26] = ("0x8000" & "0xF000") >>> 8; // this.XOR_XY()
    this.Memory[27] = ("0x0003" & "0x000F");
    this.Memory[28] = ("0x8000" & "0xF000") >>> 8; // this.ADD_XY()
    this.Memory[29] = ("0x0004" & "0x000F");
    this.Memory[30] = ("0x8000" & "0xF000") >>> 8; // this.SUB_XY()
    this.Memory[31] = ("0x0005" & "0x000F");
    this.Memory[32] = ("0x8000" & "0xF000") >>> 8; // this.SHR_XY()
    this.Memory[33] = ("0x0006" & "0x000F");
    this.Memory[34] = ("0x8000" & "0xF000") >>> 8; // this.SUBN()
    this.Memory[35] = ("0x0007" & "0x000F");
    this.Memory[36] = ("0x8000" & "0xF000") >>> 8; // this.SHL()
    this.Memory[37] = ("0x000E" & "0x000F");
    this.Memory[38] = ("0x9000" & "0xF000") >>> 8; // SkipIfVxNotVy
    this.Memory[39] = ("0x0000" & "0x000F");

    this.Memory[40] = ("0xA000" & "0xF000") >>> 8; // SetItoNNN
    this.Memory[41] = ("0x0000" & "0x0000");
    this.Memory[42] = ("0xB000" & "0xF000") >>> 8; // JumptoAddressAddV0
    this.Memory[43] = ("0x0000" & "0x0000");
    this.Memory[44] = ("0xC000" & "0xF000") >>> 8; // RandomANDkkStoretoVx
    this.Memory[45] = ("0x0000" & "0x0000");
    this.Memory[46] = ("0xD000" & "0xF000") >>> 8; // DrawGraphics
    this.Memory[47] = ("0x0000" & "0x0000");

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
    this.ISpecial = 70; // Index register (a special register used to store a memory address)
    this.Stack = new Uint16Array(16);
    this.KeyboardBuffer = [];

    this.display_width = 64; // Display data
    this.display_height = 32;
    this.display = new Array(this.display_width * this.display_height); // JUST USE ARRAY = []. MUCH EASIER
    console.log("Display Length: " + this.display.length);

    this.delayTimer;
    this.soundTimer;        // -1 means that the tone has already been played
    this.PC;                // Program counter
    this.Stack_pointer;     // The stack pointer to keep track of the length of the stack

    this.analyze_mode = false;  // If true, we can stop and execute one opcode at a time
	this.opcodeDone = true;     // Tracks whether the current opcode is done executing
    this.pause = false;

    //
    this.currentCPU = 1;
    this.maxCPU = 4;
    this.timersSet = false;

    // Declares emulator cycles
    this.analyze_cycle;
    this.main_cycle = [];
    this.timer_cycle;

    this.init = function() // Resets variables
    {
        this.stop(); // Stops all cycles and resets the timers as well

        for (let i = 0; i < 16; i++)
        {
            this.Registers[i] = 0;  // Resets the registers
            this.Stack[i] = 0;      // Resets the stack
        }

        for (let i = 512; i <= 4095; i++)
        {
            this.Memory[i] = 0;     // Resets the memory
        }

        this.KeyboardBuffer = [];
        this.ISpecial = 0;

        this.delayTimer = 0;
        this.soundTimer = -1;
        this.PC = 510 // The default value so that the next PC would be 512
        this.Stack_pointer = 0;

        this.currentCPU = 1;
        this.timersSet = false;

        this.analyze_mode = false;
        this.opcodeDone = true; // The default value so that fetch(), which is in main(), can run
        this.pause = false;

        // Loads the fontset into the memory
        for(i = 0; i < fontset.length; i++)
        {
            this.Memory[70 + i] = fontset[i];
        }

        this.clear_display(); // Clears the display
        graphics.render(this.display);
    };

    this.load = function(filename) // Loads a Chip8 program
    {
        var file = new XMLHttpRequest();
        file.open("GET", filename);
        file.responseType = "arraybuffer";
        file.onload = function()
        {
            var Program = new Uint8Array(file.response);
            var program_length = 0; // The length of the Chip-8 program
            for (let i = 0; i < Program.length; i += 2) // May produce a Memory error if 2 * i > 3584
            {
                let opc1 = Program[i].toString(16);
                let opc2 = Program[i + 1].toString(16);
                if (opc1.length == 1)
                {
                    opc1 = "0" + opc1;
                }
                if (opc2.length == 1)
                {
                    opc2 = "0" + opc2;
                }
                let opc = "0x" + opc1 + opc2; // Not necessary
                if (!isNaN(Program[i]) && !isNaN(Program[i + 1])) // Makes sure the next opcode is actually a number
                {
                    program_length++;
                    Processor.Memory[512 + 2 * (program_length - 1)] = (opc & "0xFF00") >>> 8; // Use opc1
                    Processor.Memory[512 + 2 * (program_length - 1) + 1] = (opc & "0x00FF");   // Use opc2
                }
            }
        }
        file.send(null);
    };
    this.loadComp = function(compilation)
    {
        var Program = new ArrayBuffer(compilation.length);
        var program_length = 0; // The length of the Chip-8 program
        var memIndex = 512;

        for (let i = 0; i < compilation.length; i += 2)
        {
            // Each element holds a byte, which is half an opcode.
            Program[i] = compilation.charCodeAt(i);
            Program[i + 1] = compilation.charCodeAt(i + 1);
        }

        for (let i = 0; i < Program.byteLength; i += 2)
        {
            let opc1 = Program[i].toString(16);      // This is 8 bits or 1 byte long
            let opc2 = Program[i + 1].toString(16);  // This is 8 bits or 1 byte long
            if (opc1.length == 1)
            {
                opc1 = "0" + opc1;
            }
            if (opc2.length == 1)
            {
                opc2 = "0" + opc2;
            }
            if (!isNaN(Program[i]) && !isNaN(Program[i + 1])) // Makes sure the next opcode is actually a number
            {
                program_length++;
                this.Memory[memIndex] = "0x" + opc1;
                this.Memory[memIndex + 1] = "0x" + opc2;
                memIndex += 2;
            }
        }
    };

    this.fetch = function() // Fetches the next opcode from the program stored in the memory
    {
        this.opcodeDone = false;
        this.PC += 2;
        console.log("Fetch! Increase the PC by 2!");
        console.log("PC: " + this.PC);

        // Creates the opcode
        let nextOpc;
        if (this.PC < 512 || this.PC > 4095) // Checks for an error
        {
            console.log("ERROR! ERROR! PC is out of bounds! Ending the program...");
            nextOpc = 0;
        }
        else
        {
            let opc1 = this.Memory[this.PC].toString(16);
            let opc2 = this.Memory[this.PC + 1].toString(16);
            if (opc1.length == 1)
            {
                opc1 = "0" + opc1;
            }
            if (opc2.length == 1)
            {
                opc2 = "0" + opc2;
            }
            nextOpc = "0x" + opc1 + opc2;
        }

        // Executes the opcode
        if (nextOpc != 0)
        {
            console.log("Next opcode: " + nextOpc);
            this.execute(nextOpc);
        }
        else // Reaches the end of the program
        {
            console.log("All done! :)");
        }
    };

    this.execute = function(opcode) // Finds ("reads") and executes
    {
        for (var i = 0; i < 512; i += 2) // Traverses over memory locations 0 to 511 (0x01FF)
        {
            if ((opcode & "0xF000") >>> 8 == this.Memory[i]) // Finds a match
            {
                if (i == 6) // jp_addr()
                {
                    this.jp_addr(opcode);
                    break;
                }
                else if (i == 8) // this.call_addr()
                {
                    this.call_addr(opcode);
                    break;
                }
                else if (i == 10) // SkipNextInstruction_VxEQkk
                {
                    if (this.Registers[(opcode & "0x0F00") >>> 8] == (opcode & "0x00FF"))
                    {
                        this.PC += 2;
                        //console.log("Increased PC to: " + Processor.PC);
                    }
                    break;
                }
                else if (i == 12) // this.skip_inst_2()
                {
                    this.skip_inst_2(opcode);
                    break;
                }
                else if (i == 14) // this.skip_inst_3()
                {
                    this.skip_inst_3(opcode);
                    break;
                }
                else if (i == 16) // this.LD_1()
                {
                    this.LD_1(opcode);
                    break;
                }
                else if (i == 18) // this.ADD()
                {
                    this.ADD(opcode);
                    break;
                }
                else if (i == 38) // SkipIfVxNotVy
                {
                    if (this.Registers[(opcode & "0x0F00") >>> 8] != this.Registers[(opcode & "0x00F0") >>> 4])
                    {
                        this.PC += 2;
                        //console.log("Increased PC to: " + Processor.PC);
                    }
                    break;
                }
                else if (i == 40) // SetItoNNN
                {
                    this.ISpecial = (opcode & "0x0FFF");
                    //console.log("VI: " + this.ISpecial);
                    break;
                }
                else if (i == 42) // JumptoAddressAddV0
                {
                    this.PC = (opcode & "0x0FFF") + this.Registers[0];
                    //console.log("PC: " + this.PC);
                    break;
                }
                else if (i == 44) // RandomANDkkStoretoVx
                {
                    let rand = Math.floor(Math.random() * ("0x100"));
                    //console.log("AND-ING...");
                    this.Registers[(opcode & "0x0F00") >>> 8] = rand & (opcode & "0x00FF");
                    //console.log("V" + ((opcode & "0x0F00") >>> 8) + ": " + this.Registers[(opcode & "0x0F00") >>> 8]);
                    break;
                }
                else if (i == 46) // DrawGraphics
                {
                    this.display_test(opcode);
                    graphics.render(this.display); // May be bad to use a variable from another file
                    break;
                }

                else if (i >= 0 && i <= 5) // 0x0000 opcodes
                {
                    if (((opcode & "0xFF00") >>> 8) == this.Memory[i] && (opcode & "0x00FF") == this.Memory[i + 1])
                    {
                        if (i == 2) // ClearDisplay
                        {
                            this.clear_display();
                            graphics.render(this.display);
                            break;
                        }
                        else if (i == 4) // this.stack_return()
                        {
                            this.stack_return();
                            break;
                        }
                    }
                    else // this.exec_subrout() // BUGGY!
                    {
                        continue;
                    }
                }

                else if (i >= 20 && i <= 37) // 0x8000 opcodes
                {
                    if ((opcode & "0x000F") == this.Memory[i + 1])
                    {
                        if (i == 20) // this.LD_2()
                        {
                            this.LD_2(opcode); // this.LD_2()
                            break;
                        }
                        else if (i == 22) // this.OR_1()
                        {
                            this.OR_1(opcode);
                            break;
                        }
                        else if (i == 24) // this.AND_XY()
                        {
                            this.AND_XY(opcode);
                            break;
                        }
                        else if (i == 26) // this.XOR_XY()
                        {
                            this.XOR_XY(opcode);
                            break;
                        }
                        else if (i == 28) // this.ADD_XY()
                        {
                            this.ADD_XY(opcode);
                            break;
                        }
                        else if (i == 30) // this.SUB_XY()
                        {
                            this.SUB_XY(opcode)
                            break;
                        }
                        else if (i == 32) // this.SHR_XY()
                        {
                            this.SHR_XY(opcode);
                            break;
                        }
                        else if (i == 34) // this.SUBN()
                        {
                            this.SUBN(opcode);
                            break;
                        }
                        else if (i == 36) // this.SHL()
                        {
                            this.SHL(opcode);
                            break;
                        }
                    }
                    else
                    {
                        continue;
                    }
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
                                [49, 50, 51, 52, 81, 87,
                                    69, 82, 65, 83, 68, 70,
                                    90, 88, 67, 86];
                                for (i = 0; i < 16; i++)
                                {
                                    if (code == i)
                                    {
                                        return(key_code[i]);
                                    }
                                }
                            };

                            var key = convertHex(hexCode);
                            if (typeof key == "undefined")
                            {
                                console.log("ERROR! ERROR! The hexadecimal value in Vx is too big.");
                            }
                            if (this.KeyboardBuffer[0] == key && typeof key != "undefined")
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
                                [49, 50, 51, 52, 81, 87,
                                    69, 82, 65, 83, 68, 70,
                                    90, 88, 67, 86];
                                for (i = 0; i < 16; i++)
                                {
                                    if (code == i)
                                    {
                                        return(key_code[i]);
                                    }
                                }
                            };

                            var key = convertHex(hexCode);
                            if (typeof key == "undefined")
                            {
                                console.log("ERROR! ERROR! The hexadecimal value in Vx is too big.");
                            }
                            if (this.KeyboardBuffer[0] != key && typeof key != "undefined")
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
                            //console.log("V" + ((opcode & "0x0F00") >>> 8) + ": " + this.Registers[(opcode & "0x0F00") >>> 8]);
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
                                for (i = 0; i < 16; i++)
                                {
                                    var keys = [1, 2, 3, 4,
                                        "Q", "W", "E", "R",
                                        "A", "S", "D", "F",
                                        "Z", "X", "C", "V"];
                                    var key_code = [49, 50, 51, 52,
                                        81, 87, 69, 82,
                                        65, 83, 68, 70,
                                        90, 88, 67, 86];
                                    if (key.keyCode == key_code[i])
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
                        else if (i == 56) // SetDelayTimer_VxTODT
                        {
                            this.delayTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                        else if (i == 58) // SetSoundTimer_VxTOST
                        {
                            this.soundTimer = this.Registers[((opcode & "0x0F00") >>> 8)];
                            break;
                        }
                        else if (i == 60) // AddVxIStore
                        {
                        	var Vx = this.Registers[((opcode & "0x0F00") >>> 8)];
                            var VI = this.ISpecial;
                            this.ISpecial = VI + Vx;
                            break;
                        }
                        else if (i == 62) // SetSpriteLocation
                        {
                            this.sprite_loc(opcode);
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
                                //console.log("Memory[" + this.ISpecial + "]: " + this.Memory[this.ISpecial]);
                                //console.log("Memory[" + (this.ISpecial + 1) + "]: " + this.Memory[this.ISpecial + 1]);
                                //console.log("Memory[" + (this.ISpecial + 2) + "]: " + this.Memory[this.ISpecial + 2]);
                            }
                            break;
                        }
                        else if (i == 66) // StoreV0VxtoMemory
                        {
                            if (this.ISpecial >= 0 && this.ISpecial <= 511)
                            {
                                console.log("ERROR! ERROR! I refers to a locked location in memory.");
                            }
                            else
                            {
                                for (i = 0; i <= (opcode & "0x0F00") >>> 8; i++)
                                {
                                    this.Memory[this.ISpecial + i] = this.Registers[i];
                                    //console.log("Memory[" + (this.ISpecial + i) + "]: " + this.Memory[this.ISpecial + i]);
                                }
                                this.ISpecial += ((opcode & "0x0F00") >>> 8) + 1;
                                //console.log("VI: " + this.ISpecial);
                            }
                            break;
                        }
                        else if (i == 68) // ReadMemoryWriteV0Vx
                        {
                            if (this.ISpecial >= 0 && this.ISpecial <= 511)
                            {
                                console.log("ERROR! ERROR! I refers to a locked location in memory.");
                            }
                            else
                            {
                                for (i = 0; i <= (opcode & "0x0F00") >>> 8; i++)
                                {
                                    this.Registers[i] = this.Memory[this.ISpecial + i];
                                    //console.log("V" + i + ": " + this.Registers[i]);
                                }
                                this.ISpecial += ((opcode & "0x0F00") >>> 8) + 1;
                                //console.log("VI: " + this.ISpecial);
                            }
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
    };

    this.TickTimers = function() // The timers will decrease by one at a rate of 60Hz.
    {
        if (this.delayTimer > 0)
        {
            this.delayTimer--;
        }
        if (this.soundTimer >= 0) // -1 means that the tone has already been played
        {
            this.soundTimer--;
        }
        if (this.soundTimer == 0) // Plays a tone when the sound timer reaches 0
        {
            let tone = document.getElementById("Tone");
            tone.play();
        }
    };

    this.display_test = function(test_opcode) // DXYN opcode implementation
    {
        var x_position = this.Registers[((test_opcode & "0x0F00") >>> 8)];
        var y_position = this.Registers[((test_opcode & "0x00F0") >>> 4)];
        var N = (test_opcode & 0x000F);
        this.Registers[0xF] = 0;

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

        //console.log("Display test completed!");
    };
    this.sprite_loc = function(test_opcode) // FX29 implementation
    {
        // Sets I to the location of the sprite for the character in Vx. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
        var sprite_value = this.Registers[(test_opcode & 0x0F00) >>> 8];
        this.ISpecial = 70 + (sprite_value * 5);
        //console.log("The fontset is: " + sprite_value + ", and the fontset location is: " + this.ISpecial);
    };
    this.clear_display = function() // 00E0 opcode implementation 
    {
        // Clears the screen
        for (i = 0; i < this.display.length; i++)
        {
            this.display[i] = 0;
        }
        console.log("Cleared the display!");
    };
    this.exec_subrout = function(opcode) // 0nnn opcode implementation
    {
        // BUGGY!
        this.Stack[this.Stack_pointer] = this.PC;
        this.Stack_pointer++;
        this.PC = opcode & 0x0FFF;
        //console.log("SP: " + this.Stack_pointer + " | PC: " + this.PC);
        //console.log("The stack: " + this.Stack);
    };
    this.stack_return = function() // 00EE opcode implementation
    {
        // Returns from a subroutine
        // The interpreter sets the PC to the address at the top of the stack
        // Then subtracts 1 from the stack pointer
        if (!(typeof (this.Stack[(this.Stack_pointer - 1)]) === "undefined"))
        {
            this.PC = this.Stack[(this.Stack_pointer - 1)];
            this.Stack[(this.Stack_pointer - 1)] = 0; // Resets the stack element
            this.Stack_pointer--;
            //console.log("PC: " + this.PC + " | SP:" + this.Stack_pointer);
            //console.log("The stack: " + this.Stack);
        }
        else
        {
            console.log("ERROR! ERROR! The stack pointer is out-of-bounds.")
        }
    };
    this.jp_addr = function(opcode) // 1nnn opcode implementation
    {
        this.PC = opcode & 0x0FFF;
        this.PC -= 2;
        console.log("PC jumped to: " + this.PC);
        if (this.PC % 2 != 0) // Checks for an error
        {
            console.log("ERROR! ERROR! PC refers to an odd number."); // Gives an error without a shutdown
        }
    };
    this.call_addr = function(opcode) // 2nnn - CALL addr
    {
        // Increments the stack pointer
        // Then puts the current PC on top of the stack. The PC is then set to nnn.
        if (this.Stack_pointer < this.Stack.length)
        {
            this.Stack[this.Stack_pointer] = this.PC;
            this.Stack_pointer++;
            this.PC = opcode & 0x0FFF;
            this.PC -= 2;
            //console.log("SP: " + this.Stack_pointer + " | PC: " + this.PC);
            //console.log("The stack: " + this.Stack);
        }
        else // Gives an error if the stack is full
        {
            console.log("ERROR! ERROR! The stack is full.");
        }
    };
    this.skip_inst_2 = function(opcode) // 4xkk - SNE Vx, byte
    {
        // The interpreter compares Vx to kk, and if they are not equal, increments the PC by 2
        var kk_value = opcode & 0x00FF;
        var reg_value = this.Registers[(opcode & 0x0F00) >>> 8];
        if(kk_value != reg_value)
        {
            this.PC += 2;
        }
        console.log("PC: " + Processor.PC);
    };
    this.skip_inst_3 = function(opcode) // 5xy0 - SE Vx, Vy
    {
        // Compares Vx to Vy, and if they are equal, increments the PC by 2
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        if(reg_x == reg_y)
        {
            this.PC += 2;
        }
        console.log("PC: " + Processor.PC);
    };
    this.LD_1 = function(opcode) // 6xkk - LD Vx, byte
    {
        // The interpreter puts the value kk into Vx
        this.Registers[(opcode & 0x0F00) >>> 8] = opcode & 0x00FF;
        let x = (opcode & 0x0F00) >>> 8;
        //console.log("V" + x + ": " + this.Registers[x]);
    };
    this.ADD = function(opcode) // 7xkk - ADD Vx, byte
    {
        // Adds the value kk to Vx
        // Then stores the result in Vx
        let x = (opcode & 0x0F00) >>> 8;
        let kk = (opcode & 0x00FF);
        this.Registers[x] += kk;
        //console.log("V" + x + ": " + this.Registers[x]);
    };
    this.LD_2 = function(opcode) // 8xy0 - LD Vx, Vy
    {
        // Stores the value of Vy in Vx.
        var x = (opcode & 0x0F00) >>> 8;
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        this.Registers[x] = reg_y;
        let y = (opcode & "0x00F0") >>> 4;
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.OR_1 = function(opcode) // 8xy1 - OR Vx, Vy
    {
        // Performs a bitwise OR on the values of Vx and Vy
        // Then stores the result in Vx
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var result = reg_x | reg_y;
        this.Registers[(opcode & 0x0F00) >>> 8] = result;
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.AND_XY = function(opcode) // 8xy2 - AND Vx, Vy
    {
        // Performs a bitwise AND on the values of Vx and Vy
        // Then stores the result in Vx
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var result = reg_x & reg_y;
        this.Registers[(opcode & 0x0F00) >>> 8] = result;
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.XOR_XY = function(opcode) // 8xy3 - XOR Vx, Vy
    {
        // Performs a bitwise exclusive OR on the values of Vx and Vy
        // Then stores the result in Vx
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var result = reg_x ^ reg_y;
        this.Registers[(opcode & 0x0F00) >>> 8] = result;
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.ADD_XY = function(opcode) // 8xy4 - ADD Vx, Vy
    {
        // The values of Vx and Vy are added together.
        // If the result is greater than 8 bits (i.e., > 255,) VF is set to 1; otherwise 0.
        // Only the lowest 8 bits of the result are kept and is stored in Vx.
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var sum = reg_x + reg_y;
        this.Registers[0xF] = (sum > 255);
        this.Registers[(opcode & 0x0F00) >>> 8] = sum & 0xFF;
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        //console.log("VF: " + this.Registers[15]);
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.SUB_XY = function(opcode) // 8xy5 - SUB Vx, Vy
    {
        // If Vx > Vy, then VF is set to 1; otherwise 0. Then Vx - Vy, and the results are stored in Vx.
        let x = (opcode & 0x0F00) >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var sub = reg_x - reg_y;
        this.Registers[0xF] = (reg_x > reg_y);
        this.Registers[(opcode & 0x0F00) >>> 8] = sub;
        //console.log("VF: " + this.Registers[15]);
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.SHR_XY = function(opcode) // 8xy6 - SHR Vx {, Vy}
    {
        let x = (opcode & 0x0F00) >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        // Stores the least significant bit of Vx in VF and then shifts Vx to the right by 1
        this.Registers[0xF] = this.Registers[x] & 0x1;
        //console.log("VF: " + this.Registers[15]);
        this.Registers[y] = this.Registers[x];  // Vx doesn't change.
        this.Registers[y] /= 2;                 // Results are stored in Vy.
    //     console.log("V" + x + ": " + this.Registers[x]);
    //     console.log("V" + y + ": " + this.Registers[y]);
     };
    this.SUBN = function(opcode) // 8xy7 - SUBN Vx, Vy
    {
        // If Vy > Vx, then VF is set to 1; otherwise 0. Then Vy - Vx, and the results are stored in Vx.
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        var reg_x = this.Registers[(opcode & 0x0F00) >>> 8];
        var reg_y = this.Registers[(opcode & 0x00F0) >>> 4];
        var sub = reg_y - reg_x;
        this.Registers[0xF] = (reg_y > reg_x);
        this.Registers[(opcode & 0x0F00) >>> 8] = sub;
        //console.log("VF: " + this.Registers[15]);
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };
    this.SHL = function(opcode) // 8xyE - SHL Vx {, Vy}
    {
        let x = (opcode & "0x0F00") >>> 8;
        let y = (opcode & "0x00F0") >>> 4;
        this.Registers[15] = ((this.Registers[x] & 0x80) >>> 7);
        //console.log("VF: " + this.Registers[15]);
        this.Registers[y] = this.Registers[x];  // Vx doesn't change.
        this.Registers[y] *= 2;                 // Results are stored in Vy.
        //console.log("V" + x + ": " + this.Registers[x]);
        //console.log("V" + y + ": " + this.Registers[y]);
    };

    this.stop = function() // Stops all cycles
    {
        clearInterval(this.analyze_cycle);
        for (let i = 0; i < this.maxCPU; i++)
        {
            clearInterval(this.main_cycle[i]);
        }
        clearInterval(this.timer_cycle);

        this.currentCPU = 1; // Resets the current number of running CPU's
        this.timersSet = false;
        /*// Also resets the timers as a bonus
        this.delayTimer = 0;
        this.soundTimer = -1;*/
    };
    this.analyze = function() // Stops the main function and starts the analyze-mode
    {
        console.log("Analyze-mode turned on!");
        var _this = this;
        var timer_cycle = 0;
        this.analyze_cycle = setInterval(function()
        {
            window.onkeydown = function(event)
            {
                if (event.keyCode == 192) // Hit ` to exit analyze-mode.
                {
                    _this.stop(); // Stops all cycles
                    _this.analyze_mode = false;
                    _this.main();
                }
                else if (event.keyCode == 113) // Hit F2 to advance to the next opcode.
                {
                    if (!_this.pause)
                    {
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
                                    console.log("Removed a key from the keyboard array!");
                                }
                            }
                        }
                        window.onkeyup = null;
                    };

                    if (!_this.pause && _this.opcodeDone)
                    {
                        _this.fetch();
                    }

                    timer_cycle++;
                    if (timer_cycle >= 8)
                    {
                        _this.TickTimers();
                        timer_cycle = 0;
                    }
                }
                updateVisualizer();
                window.onkeydown = null;
            }
        }, 2);
    };
    this.main = function()
    {
        var _this = this;

        if (!this.timersSet) // Makes sure only one timer cycle runs
        {
            this.timersSet = true;
            this.timer_cycle = setInterval(this.TickTimers.bind(this), 16.6667); // Each timer ticks every 16.6667 ms.
        }
        this.main_cycle[this.currentCPU - 1] = setInterval(function()
        {
            if (!_this.analyze_mode)
            {
                if (!_this.pause)
                {
                    window.onkeydown = function(event)
                    {
                        if (_this.KeyboardBuffer.length == 0)
                        {
                            _this.KeyboardBuffer.push(event.keyCode);
                        }
                        if (event.keyCode == 192) // Hit ` to enter analyze-mode.
                        {
                            _this.stop(); // Stops all cycles
                            _this.analyze_mode = true;
                            _this.analyze();
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
                                console.log("Removed a key from the keyboard array!");
                            }
                        }
                    }
                    window.onkeyup = null;
                };

                if (!_this.pause && _this.opcodeDone)
                {
                    _this.fetch();
                }
            }
            updateVisualizer();
        }, 2); // Each emulator cycle happens every 2 ms.
    };
    this.speed_up = function() // This should not run if the Emulator has stopped or automated testing is running
    {
        if (this.pause || this.analyze_mode)
        {
            console.log("ERROR! ERROR! Emulator cannot speed up. It is paused.")
        }
        else
        {
            if (this.currentCPU >= this.maxCPU)
            {
                console.log("ERROR! ERROR! Maximum speed reached!")
            }
            else
            {
                this.currentCPU++;
                this.main();
            }
        }
    };
}