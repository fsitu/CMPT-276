function updateVisualizer()
{
    // Displays Vx's
    for (let i = "0"; i <= 15; i++)
    {
        document.getElementById("V" + i).innerHTML = "<b>V" + i + ":</b> " + formatHex(Processor.Registers[i], 2).toUpperCase(); // Maybe I should use CSS to make the text bold
    }

    // Displays the memory
    var memorylist = "\n";
    for (let i = 0; i <= 4095; i++)
    {
        memorylist += " " + i + ": \t" + formatHex(Processor.Memory[i], 2).toUpperCase() + "\n";
    }
    document.getElementById("MEMORY").value = memorylist;

    // Displays the PC, VI, DT, and ST
    var misc = "<b>PC:</b> " + Processor.PC;
    misc += "\n\n<b>VI:</b> " + Processor.ISpecial;
    misc += "\n\n<b>Delay Timer:</b> " + Processor.delayTimer;
    if (Processor.soundTimer < 0)
    {
        misc += "\n\n<b>Sound Timer:</b> " + 0;
    }
    else
    {
        misc += "\n\n<b>Sound Timer:</b> " + Processor.soundTimer;
    }
    document.getElementById("MISC").innerHTML = misc;
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