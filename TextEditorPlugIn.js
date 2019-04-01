function ModifyCode()
{
    document.getElementById('key2').style.visibility = "visible";
    document.getElementById('key2').value = "";
    var my_code = document.getElementById('key1').value;
    var addSubrout = false;
    var opcodes = [];
    var subroutIndex = 1000;
    var subroutines = [];
    //var variables = {};       // Is a dict
    var variables = new Map();  // Is a map
    my_code = my_code.split("\n");
    for (let element of my_code)
    {
        element = element.trim();
        var token = "";
        var tokens = [];

        for (let char of element)
        {
            if (char && !(/^\s*$/.test(char)))
                token += char;
            else
            {
                tokens.push(token);
                token = "";
            }
        }
        tokens.push(token);
        lower = x => x.toLowerCase();
        tokens = tokens.map(lower);

        // Handles variables
        if (tokens[0] == "var")
            //variables[tokens[1]] = tokens[2];
            variables.set(tokens[1], tokens[2]);

        // Replaces variables
        tokens[1] = replaceVar(variables, tokens[1]);
        tokens[2] = replaceVar(variables, tokens[2]);
        tokens[3] = replaceVar(variables, tokens[3]);

        // Handles subroutines
        if (tokens[0] == "subrout" || tokens[0] == "funct")
        {
            addSubrout = true;
            variables.set(tokens[1], subroutIndex);
        }
        else if (tokens[0] == "ret") // Ends the subroutine
        {
            opcodes.push("00EE");
            subroutines.push(addSubrout);
            addSubrout = false;
        }

        // Handles other opcodes
        if (tokens[0] == "cls")
        {
            opcodes.push("00E0");
            subroutines.push(addSubrout);
        }

        else if (tokens[0] == "jp")
        {
            if (!isNaN(tokens[1]))
            {
                //document.getElementById('key2').value = "Your Opcode:  1"+my_code[3]+my_code[4]+my_code[5] +"  Comment: JP addr Jump to location nnn. The interpreter sets the program counter to nnn.";
                var nnn = formatHex((+tokens[1]).toString(16), 3);
                opcodes.push("1" + nnn);
                subroutines.push(addSubrout);
            }
            else if (tokens[1] == "v0" && !isNaN(tokens[2]))
            {
                var nnn = formatHex((+tokens[2]).toString(16), 3);
                opcodes.push("B" + nnn);
                subroutines.push(addSubrout);
            }
        }

        else if (tokens[0] == "call")
        {
            if (!isNaN(tokens[1]))
            {
                //document.getElementById('key2').value = "Your Opcode:  2"+my_code[5]+my_code[6]+my_code[7] +"  Comment: The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn."
                tokens[1] = formatHex((+tokens[1]).toString(16), 3);
                opcodes.push("2" + tokens[1]);
                subroutines.push(addSubrout);
            }
        }

        else if (tokens[0] == "se")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && !isNaN(tokens[2].slice(1)) && tokens[2].slice(1) <= 15)
                {
                    var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                    var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                    opcodes.push("5" + Vx + Vy + "0");
                    subroutines.push(addSubrout);
                }
            }
            else if (tokens[1][0] == "v" && !isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && !isNaN(tokens[2]) && tokens[2] <= 255)
            {
                var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                var kk = formatHex((+tokens[2]).toString(16), 2);
                opcodes.push("3" + Vx + kk);
                subroutines.push(addSubrout);
            }
        }

        else if (tokens[0] == "sne")
        {
            //tokens[1] = replaceVar(variables, tokens[1]);
            //tokens[2] = replaceVar(variables, tokens[2]);
            if (tokens[1][0] == "v" && !isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && !isNaN(tokens[2]) && tokens[2] <= 255)
            {
                var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                var kk = formatHex((+tokens[2]).toString(16), 2);
                opcodes.push("4" + Vx + kk);
                subroutines.push(addSubrout);
            }
        }

        else if (tokens[0] == "ld")
        {
            if (tokens[1][0] == "v" && !isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && tokens[2] == "dt")
            {
                var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "07");
                subroutines.push(addSubrout);
            }
            else if (tokens[1][0] == "v" && !isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && tokens[2] == "k")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[3] + "0A";
                var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "0A");
                subroutines.push(addSubrout);
            }
            else if (tokens[2][0] == "v" && !isNaN(tokens[2].slice(1)) && tokens[2].slice(1) <= 15 && tokens[1] == "dt")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[7] + "15";
                var Vx = formatHex((+tokens[2].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "15");
                subroutines.push(addSubrout);
            }
            else if (tokens[2][0] == "v" && !isNaN(tokens[2].slice(1)) && tokens[2].slice(1) <= 15 && tokens[1] == "st")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[7] + "18";
                var Vx = formatHex((+tokens[2].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "18");
                subroutines.push(addSubrout);
            }
            else if (tokens[2][0] == "v" && !isNaN(tokens[2].slice(1)) && tokens[2].slice(1) <= 15 && tokens[1] == "b")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[6] + "33";
                var Vx = formatHex((+tokens[2].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "33");
                subroutines.push(addSubrout);
            }
            else if (tokens[2][0] == "v" && !isNaN(tokens[2].slice(1)) && tokens[2].slice(1) <= 15 && tokens[1] == "i")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[8] + "55";
                var Vx = formatHex((+tokens[2].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "55");
                subroutines.push(addSubrout);
            }
            else if (tokens[1][0] == "v" && !isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15 && tokens[2] == "i")
            {
                //document.getElementById('key2').value = "Your Opcode:  F"+my_code[3] + "65";
                var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                opcodes.push("F" + Vx + "65");
                subroutines.push(addSubrout);
            }
            else if (tokens[1][0] == "v" && tokens[2][0] != "v")
            {
                //document.getElementById('key2').value = "Your Opcode:  6"+my_code[3] + "kk";
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2]))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2] <= 255)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var kk = formatHex((+tokens[2]).toString(16), 2);
                        opcodes.push("6" + Vx + kk);
                        subroutines.push(addSubrout);
                    }
                }
            }
            else if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "0");
                        subroutines.push(addSubrout);
                    }
                }
            }
            else if (tokens[1] == "i")
            {
                if (!isNaN(tokens[2]))
                {
                    var nnn = formatHex((+tokens[2]).toString(16), 3);
                    opcodes.push("A" + nnn);
                    subroutines.push(addSubrout);
                }
            }
        }

        else if (tokens[0] == "or")
        {
            //document.getElementById('key2').value = "Your Opcode:  8"+my_code[3]+my_code[6] + "1";
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "1");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "and")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "2");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "xor")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "3");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "add")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "4");
                        subroutines.push(addSubrout);
                    }
                }
            }
            else if (tokens[1][0] == "v" && tokens[2][0] != "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2]))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2] <= 255)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var kk = formatHex((+tokens[2]).toString(16), 2);
                        opcodes.push("7" + Vx + kk);
                        subroutines.push(addSubrout);
                    }
                }
            }
            else if (tokens[1] == "i" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[2].slice(1)))
                {
                    if (tokens[2].slice(1) <= 15)
                    {
                        //document.getElementById('key2').value = "Your Opcode:  F"+my_code[4]+"1E";
                        var Vx = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("F" + Vx + "1E");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "sub")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "5");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "shr")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "6");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "subn")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "7");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "shl")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("8" + Vx + Vy + "E");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "sne")
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        opcodes.push("9" + Vx + Vy + "0");
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "rnd") 
        {
            if (tokens[1][0] == "v" && tokens[2][0] != "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2]))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2] <= 255)
                    {
                        //document.getElementById('key2').value = "Your Opcode:  C"+my_code[4]+"kk";
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var kk = formatHex((+tokens[2]).toString(16), 2);
                        opcodes.push("C" + Vx + kk);
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "drw") 
        {
            if (tokens[1][0] == "v" && tokens[2][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)) && !isNaN(tokens[3]))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15 && tokens[3] <= 15)
                    {
                        //document.getElementById('key2').value = "Your Opcode:  D"+my_code[4]+my_code[7]+my_code[10];
                        var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                        var Vy = formatHex((+tokens[2].slice(1)).toString(16), 1);
                        var nibble = formatHex((+tokens[3]).toString(16), 1);
                        opcodes.push("D" + Vx + Vy + nibble);
                        subroutines.push(addSubrout);
                    }
                }
            }
        }

        else if (tokens[0] == "skp") 
        {
            if (tokens[1][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15)
                {
                    //document.getElementById('key2').value = "Your Opcode:  E"+my_code[4]+"9E";
                    var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                    opcodes.push("E" + Vx + "9E");
                    subroutines.push(addSubrout);
                }
            }
        }

        else if (tokens[0] == "sknp") 
        {
            if (tokens[1][0] == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && tokens[1].slice(1) <= 15)
                {
                    //document.getElementById('key2').value = "Your Opcode:  E"+my_code[5]+"A1";
                    var Vx = formatHex((+tokens[1].slice(1)).toString(16), 1);
                    opcodes.push("E" + Vx + "A1");
                    subroutines.push(addSubrout);
                }
            }
        }

        if (addSubrout)
            subroutIndex++;
    }

    for (let i = 0; i < opcodes.length; i++)
        if (!subroutines[i])
            document.getElementById('key2').value += opcodes[i].trim().toUpperCase() + "\n";
    if (subroutines.includes(true)) // Ignores this part if there is no subroutines
    {
        let current_opcs = document.getElementById('key2').value;
        let size = (1000 - 512) / 2 - current_opcs.trim().split(/\r\n|\r|\n/).length;
        //let subroutIndex = 0;
        //let updateFunc = true;

        // The following is fairly inefficient.
        for (var i = 0; i < size; i++)
            document.getElementById('key2').value += "0000\n";
        for (let i = 0; i < opcodes.length; i++)
            if (subroutines[i])
            {
                /*if (updateFunc)
                    for (let [key, value] of variables.entries())
                        if (value == "UNASSIGNED")
                        {
                            updateFunc = false;
                            variables.set(key, 1000 + subroutIndex);
                            break;
                        }
                if (opcodes[i].trim().toUpperCase() == "00EE")
                    updateFunc = true;*/
                document.getElementById('key2').value += opcodes[i].trim().toUpperCase() + "\n";
                //subroutIndex++;
            }
    }
    document.getElementById('key2').value = document.getElementById('key2').value.trim();
    viewVar(subroutines, variables);
}

function formatHex(hex, length)
{
    hex = hex.toString(16);
    if (hex.length == 1 && length == 2)
        return "0" + hex;
    else if (hex.length == 1 && length == 3)
        return "00" + hex;
    else if (hex.length == 2 && length == 3)
        return "0" + hex;
    else
        return hex;
}

function replaceVar(varList, varName)
{
    //if (varList[varName]) // The variable is in the variables list.
    if (varList.has(varName)) // The variable is in the variables list.
        //return varList[varName];
        return varList.get(varName);
    else
        return varName;
}

function viewVar(subroutList, varList)
{
    console.clear();
    console.log(subroutList);
    for (let [key, value] of varList.entries())
        console.log(key.toUpperCase() + ": " + value.toString().toUpperCase() + "\n");
}