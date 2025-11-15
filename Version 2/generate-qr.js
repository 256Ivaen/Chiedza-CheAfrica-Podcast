const QRCode = require('qrcode-svg');
const fs = require('fs');

function generateProfessionalQR() {
  // Get current date
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  const currentMonth = now.getMonth() + 1; // Months are 0-indexed (0=January, 11=December)
  const currentDay = now.getDate();
  
  // Check if it's December 1st or later
  if (currentMonth < 12 || (currentMonth === 12 && currentDay < 1)) {
    const config = {
      content: "Your too early for this Promotion: Come back again on December 1st",
      padding: 4,
      width: 400,
      height: 400,
      color: "#FF0000",
      background: "transparent",
      ecl: "H",                
      join: true,
      pretty: true,
      title: "Too Early",
      description: "QR code not yet activated"
    };

    const qrcode = new QRCode(config);
    let svg = qrcode.svg();
    
    fs.writeFileSync('./assets/emergesocialcare-qr-code.svg', svg);
    console.log("QR code generated with 'Too Early' message: emergesocialcare-qr-code.svg");
    return;
  }

  // Get current time for greeting
  const hours = now.getHours();
  let greeting = "Hello";
  
  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // Create WhatsApp message with proper URL encoding
  const message = `${greeting}%0A%0AI would like to make a pizza order for ${currentDate}.`;
  
  const whatsappLink = `https://wa.me/256742505052?text=${message}`;

  const config = {
    content: whatsappLink,
    padding: 4,
    width: 400,
    height: 400,
    color: "#2D3748",
    background: "transparent",
    ecl: "H",                
    join: true,
    pretty: true,
    title: "Pizza Order",
    description: "Scan to place your pizza order"
  };

  const qrcode = new QRCode(config);
  let svg = qrcode.svg();
  
  fs.writeFileSync('./assets/emergesocialcare-qr-code.svg', svg);
  console.log("Pizza order QR code generated: emergesocialcare-qr-code.svg");
}

generateProfessionalQR();