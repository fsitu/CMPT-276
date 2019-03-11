function updateVisualizer()
{
    // Displays Vx's
    for (let i = "0"; i <= 15; i++)
    {
        document.getElementById("V" + i).innerHTML = "V" + i + ": " + Processor.Registers[i];
    }

    // Displays the memory
    var memorylist = "MEMORY:\n";
    for (let i = 0; i <= 4095; i++)
    {
        memorylist += i + ": " + Processor.Memory[i] + "\n";
    }
    document.getElementById("MEMORY").value = memorylist;

    // Displays VI, DT, and ST
    var misc = "VI: " + Processor.ISpecial;
    misc += "\n\nDelay Timer: " + Processor.delayTimer;
    if (Processor.soundTimer < 0)
    {
        misc += "\n\nSound Timer: " + 0;
    }
    else
    {
        misc += "\n\nSound Timer: " + Processor.soundTimer;
    }
    document.getElementById("MISC").innerHTML = misc;
}