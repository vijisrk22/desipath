const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Events.jsx',
  'src/components/SearchAndFilter.jsx',
  'src/components/Services.jsx',
  'src/components/Events/EventCard.jsx',
  'src/components/Events/EventsHeader.jsx',
  'src/components/Events/ReviewEventPost.jsx',
  'src/components/Navbar/MobileBottomNav.jsx',
  'src/components/User/MyListings.jsx',
  'src/pages/PostAdPage.jsx',
  'src/pages/PostConfirmation.jsx',
  'src/pages/Events/EventDetails.jsx',
  'src/pages/Events/EventsLanding.jsx',
  'src/pages/Events/PostEvent.jsx'
];

files.forEach(file => {
  const fullPath = path.join('F:/Desipath-code/desipath/FRONTEND', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    content = content.replace(/\/services\/events/g, '/events');
    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log('Updated', file);
    }
  } else {
    console.log('File not found:', fullPath);
  }
});
