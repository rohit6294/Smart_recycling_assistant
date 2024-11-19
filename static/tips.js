// List of environmental tips
const tips = [
    "🌍 Save the planet by using reusable bags instead of plastic ones!",
    "💡 Fun fact: Recycling one ton of paper saves 17 trees!",
    "🌱 Compost your kitchen scraps to enrich the soil and reduce waste.",
    "💧 Turn off the tap while brushing your teeth to save water.",
    "♻️ Recycle aluminum cans to save up to 95% of the energy required to make new ones!",
    "🚶‍♂️ Walk or cycle instead of driving for short distances to reduce your carbon footprint.",
    "🌳 Plant a tree! A single tree can absorb up to 48 pounds of CO2 annually.",
    "🔌 Unplug electronics when not in use to save energy and reduce electricity bills.",
    "📦 Reuse cardboard boxes and packaging for storage or crafting.",
    "🍃 Avoid single-use plastics; switch to biodegradable alternatives.",
    "🚿 Take shorter showers to conserve water and energy.",
    "🌡️ Set your thermostat a few degrees lower in winter and higher in summer to save energy.",
    "🍽️ Reduce food waste by planning meals and storing leftovers properly.",
    "🌎 Choose eco-friendly products with minimal packaging.",
    "🎋 Bamboo is a sustainable alternative to plastic and wood – try bamboo straws or utensils.",
    "🛍️ Carry a reusable water bottle and coffee cup to reduce waste.",
    "📖 Donate or exchange old books instead of throwing them away.",
    "🔋 Recycle used batteries and e-waste responsibly.",
    "🍂 Fallen leaves make excellent mulch for your garden!",
    "🌊 Avoid littering beaches or water bodies to protect marine life.",
    "🧴 Use eco-friendly cleaning products free of harsh chemicals.",
    "🌟 Fun fact: Glass takes over 4,000 years to decompose but is 100% recyclable!",
    "🌲 Deforestation is responsible for 15% of all greenhouse gas emissions—save paper!",
    "🚗 Carpool or use public transport to cut down on emissions.",
    "🍃 Eat locally grown food to reduce the carbon footprint of transportation.",
    "🎨 Get creative! Repurpose old clothes or furniture instead of throwing them away.",
    "🐾 Protect wildlife by keeping forests clean and supporting conservation efforts.",
    "💻 Use energy-efficient devices with a high Energy Star rating.",
    "🍎 Buying in bulk reduces the amount of plastic packaging waste.",
    "🌾 Fun fact: One acre of hemp can produce as much paper as 4-10 acres of trees in a year!",
    "🧼 Try making DIY natural cleaners with ingredients like vinegar and baking soda.",
    "🗑️ Always segregate your waste into recyclables, compostables, and trash.",
    "🌿 Switch to renewable energy sources like solar or wind power, if possible.",
    "🎉 Organize eco-friendly events with zero-waste policies!",
    "🦋 Create a pollinator-friendly garden to help bees and butterflies thrive.",
    "🏠 Insulate your home to reduce heating and cooling costs.",
    "🚯 Fun fact: Cigarette butts are the most littered item worldwide—dispose of them responsibly!",
    "🍳 Use energy-efficient cooking methods, like pressure cookers and induction stoves.",
    "🌼 Grow your own herbs and vegetables to reduce reliance on transported produce.",
    "🛏️ Donate old clothes and linens instead of discarding them.",
    "📚 Share environmental knowledge and inspire others to act sustainably!"
];


document.addEventListener("DOMContentLoaded", () => {
    const popupTip = document.getElementById("popupTip");
    const tipText = document.getElementById("tipText");
    const closeTip = document.getElementById("closeTip");

    // Display a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    tipText.textContent = randomTip;

    // Show the tip container
    popupTip.classList.remove("hidden");

    // Close button functionality
    closeTip.addEventListener("click", () => {
        popupTip.classList.add("hidden");
    });

    // Auto-hide the tip after 10 seconds
    setTimeout(() => {
        popupTip.classList.add("hidden");
    }, 10000);
});
