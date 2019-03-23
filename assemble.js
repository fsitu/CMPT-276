function assemble(text)
{
    document.getElementById('key2').style.visibility="visible";
    var addSubrout = false;
    var opcodes = "";
    var subroutIndex;
    var subroutines = {};
    var variables = {};
    //text = text.replace(/\s/g, "");
    text = text.split("\n");
    for (let element of text)
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
        if (tokens[1] == "var")
            variables[tokens[0]] = tokens[2];

        // Handles subroutines
        else if (tokens[1] == "subrout" || tokens[1] == "funct")
        {
            addSubrout = true;
            if (Object.keys(subroutines).length == 0) // Puts the first subroutine at Memory[1000]
                subroutIndex = 1000;
            subroutines[subroutIndex] = "";
            variables[tokens[0]] = subroutIndex.toString(16);
        }
        else if (tokens[0] == "ret") // Ends the subroutine
        {
            subroutines[subroutIndex] += "00EE" + "\n";
            addSubrout = false;
            subroutIndex++;
        }

        // Handles other opcodes
        else if (tokens[0] == "cls")
        {
            if (addSubrout)
            {
                subroutines[subroutIndex] += "00E0" + "\n";
                subroutIndex++;
                subroutines[subroutIndex] = "";
            }
            else
                opcodes += "00E0" + "\n";
        }
        else if (tokens[0] == "ld")
        {
            tokens[1] = replaceVar(variables, tokens[1]);
            tokens[2] = replaceVar(variables, tokens[2]);

            if (tokens[1][0].toLowerCase() == "v" && tokens[2][0].toLowerCase() != "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2]))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2] <= 255)
                    {
                        if (addSubrout)
                        {
                            subroutines[subroutIndex] += "6" + (+tokens[1].slice(1)).toString(16) + (+tokens[2]).toString(16) + "\n";
                            subroutIndex++;
                            subroutines[subroutIndex] = "";
                        }
                        else
                            opcodes += "6" + (+tokens[1].slice(1)).toString(16) + (+tokens[2]).toString(16) + "\n";
                    }
                    else
                    {
                        throwError();
                        break;
                    }
                }
                else
                {
                    throwError();
                    break;
                }
            }
            else if (tokens[1][0].toLowerCase() == "v" && tokens[2][0].toLowerCase() == "v")
            {
                if (!isNaN(tokens[1].slice(1)) && !isNaN(tokens[2].slice(1)))
                {
                    if (tokens[1].slice(1) <= 15 && tokens[2].slice(1) <= 15)
                    {
                        if (addSubrout)
                        {
                            subroutines[subroutIndex] += "8" + (+tokens[1].slice(1)).toString(16) + (+tokens[2].slice(1)).toString(16) + "0\n";
                            subroutIndex++;
                            subroutines[subroutIndex] = "";
                        }
                        else
                            opcodes += "8" + (+tokens[1].slice(1)).toString(16) + (+tokens[2].slice(1)).toString(16) + "0\n";
                    }
                    else
                    {
                        throwError();
                        break;
                    }
                }
                else
                {
                    throwError();
                    break;
                }
            }
            else if (tokens[1][0].toLowerCase() == "f" && tokens[2][0].toLowerCase() == "v") // No error-checking yet
            {
                if (addSubrout)
                {
                    subroutines[subroutIndex] += "F" + (+tokens[2].slice(1)).toString(16) + "29\n";
                    subroutIndex++;
                    subroutines[subroutIndex] = "";
                }
                else
                    opcodes += "F" + (+tokens[2].slice(1)).toString(16) + "29\n";
            }
            else
            {
                throwError();
                break;
            }
        }
        else if (tokens[0] == "drw")
        {
            tokens[1] = replaceVar(variables, tokens[1]);
            tokens[2] = replaceVar(variables, tokens[2]);
            if (tokens[1][0].toLowerCase() == "v" && tokens[2][0].toLowerCase() == "v")
            {
                if (addSubrout)
                {
                    subroutines[subroutIndex] += "D" + (+tokens[1].slice(1)).toString(16) + (+tokens[2].slice(1)).toString(16) + (+tokens[3]).toString(16) + "\n";
                    subroutIndex++;
                    subroutines[subroutIndex] = "";
                }
                else
                    opcodes += "D" + (+tokens[1].slice(1)).toString(16) + (+tokens[2].slice(1)).toString(16) + (+tokens[3]).toString(16) + "\n";
            }
            else
            {
                throwError();
                break;
            }
        }
        else
        {
            throwError();
            break;
        }
    }

    if (Object.keys(subroutines).length != 0) // Ignores this part if there is no subroutines
    {
        let size = (1000 - 512) / 2 - opcodes.trim().split(/\r\n|\r|\n/).length;
        for (var i = 0; i < size; i++)
            opcodes += "0000\n";
        for (let key in subroutines)
            opcodes += subroutines[key];
    }

    document.getElementById('key2').value = opcodes.trim().toUpperCase();
    viewVar(subroutines, variables);
}

function throwError()
{
    alert("ERROR! ERROR!");
}

function replaceVar(varList, varName)
{
    if (varList[varName]) // The variable is in the variables list.
        return varList[varName];
    else
        return varName;
}

function viewVar(subroutList, varList)
{
    console.log(subroutList);
    for (let key in varList)
        console.log(key.toUpperCase() + ": " + varList[key].toUpperCase() + "\n");
}