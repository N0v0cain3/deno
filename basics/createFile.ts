const encoder = new TextEncoder();

const greetText = encoder.encode("Hello World\n Slavery was a choice");

await Deno.writeFile("greet.txt", greetText);
