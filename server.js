const app = require('./api/index');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at https://bills-psi.vercel.app:${PORT}/api`);
});
