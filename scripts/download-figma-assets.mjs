import fs from 'fs';
import path from 'path';

const assets = [
  // Header / TopBar / Common
  "14feb7923d10e1372397793711962f265e88f9a9.svg",
  "05a01fbaf599eb3c1a3b10b0051280a5682ec29a.svg",
  // Hero (fresh from 12:714)
  "e40866062bc7c3587c903859bd52be66623217cc.png",
  "2fc0a1c70056162f5d32de1029e4b71d620e97c4.png",
  "2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png",
  "b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png",
  "d6fbd1298a91240247b0a088b0f1da19e38dcbd4.png",
  "9eb6b22f5c81a72b2a90e105fc53b2ba16eb1bf4.svg",
  "d9c6ca87acaa4467665d47731de04dda988842eb.svg",
  "1009d81a82644fe92f9059e7792d4b2dd46eaab7.svg",
  "62e0189d2523908b33efb81df87265ba9570cefd.svg",
  "edb6a531a1489b04b7637b5ada8d4ab1d2695717.svg",
  "52f212ce1d5856de39c345a5483b7fbbe1e9712b.svg",
  "72ec619ff8b3151dbee655baadb01afaf522ea4d.svg",
  "8263b1f1b457ebc83e9a52d57ea805c7651a93d3.svg",
  "ed3ca1377cb8b78d00124c758fb07f7f3e4b96b3.svg",
  // Courses Carousel (12:791)
  "00d85e9072dd2031d3c61249ae87330dd98d7556.png",
  "25529efd44db48bf72d165e12602fb303b26e334.svg",
  "7e635e8b59ce7f15037ff0b006b70a0207e8eb47.svg",
  "48831cf95e69552fa812f45a5c056306f73faeef.svg",
  "ea02cac4944bde6cde1e402e28b33e357e82907b.svg",
  "8662279aaadf62aad31933d1106fc732ef02cd49.svg",
  "a771b8e34fadf4f48a6dac87c9b6b234f1566ca5.svg",
  "1b5f8f076a57a8346bfc6213a03e5bba4777cd2d.svg",
  "87368d31e0e06151c11baacd5345e4102ccba501.svg",
  // Why choose us (12:792)
  "74b9c4a05863014e829874effcdb4e101a4bfaea.png",
  // Company logos (12:813)
  "b748b0ab9014b6a1cbd85bf1b193c9df632e3a0e.svg",
  "3205cfb73b9637bd76f7bc3def62832768ee22f2.svg",
  "75956f03862fa0debc17f2d607e9b960a43b1a28.svg",
  "075eba8302418813840095c4bf8c181d5f6b1dd2.svg",
  "87684c46342ae29eb4c1281729f85f5cfc562efc.svg",
  "480d74d474dae2a29b22a63a3d76ce3805a2b88c.svg",
  "e6061a5a605064b9a3a73cce0f922e71fc6af1fe.svg",
  "15a7d65e2db97a2b937dc4548b1d089b55920fae.svg",
  // Pricing Combo (12:1175)
  "ae7139e451fb9f873198b04a809e63e17fd7844b.png",
  "6c4e9df59fb1899b4f4f210376aa3c68ed53766d.svg",
  "427717fb616f6e486ff78a45ffe62b030a5012e7.svg",
  "bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg",
  "9f1a96eecae4b4f084d165577ecbd536619faec6.svg",
  // Student projects (12:873)
  "2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
  "973e833b234c55daebe419eefe02eb6e80f7d86d.png",
  "f0920e49e6a571ac94250b3258b77d8c976423b6.png",
  "cf9dcd253d74531ef55b272e2e080b01e9bbd6bb.png",
  "1af45d712faebc37b4905756835680a337298304.png",
  "c0aae3c5c5404ee626ce858087d79649de2e3dc1.png",
  "b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
  "c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
  "05ab7dcc030820120da8f65c6b464967f554e0d8.png",
  // Blogs (12:838)
  "71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
  "9ae6db40cb06e228d0f434d2c9739a435ba6a95c.svg",
  "70340ea32945fa029d00564b7bfe09d5dc4353a1.svg",
  "c0c17c3542fd671a5b815564ab15145b03068c39.svg",
  // Floating CTA (12:1272)
  "5b4b011e79a58bd7bf7adc73dcbec0c01705d59d.png",
  "08742fdf977fc095f72d070c8238ee5aa891910d.png",
  "8fe9a4f9a84f57b0ad7f6050d87f9e45e18d5902.svg",
  // Footer (12:1046)
  "5d3dc012b6a90ac35f204a321ac874ed53b35e81.png",
  "b5e37fb98f29c6fe09b28906ad379fd1e22d5abf.png",
  "fb2492c1b7d7c65a104edaa8e809cc8a5a19315f.png"
];

const targetDir = path.join(process.cwd(), 'public', 'assets', 'figma');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadAll() {
  console.log(`Starting download of ${assets.length} Figma assets to ${targetDir}...`);
  let successCount = 0;
  for (const asset of assets) {
    const url = `http://127.0.0.1:3845/assets/${asset}`;
    const dest = path.join(targetDir, asset);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      successCount++;
      continue;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed ${asset}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      successCount++;
    } catch (err) {
      console.warn(`Error downloading ${asset}:`, err.message);
    }
  }
  console.log(`Downloaded ${successCount}/${assets.length} assets successfully.`);
}

downloadAll();
