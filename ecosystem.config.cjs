const path = require("node:path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
// sáng 08/09/2026 - đang dừng ở 12:45
// Bản chất

// 1. Khi chạy "pm2 start ecosystem.config.cjs" -> PM2/Node đọc file config trước.

// 1.1. Trên Windows:
// process.platform === "win32"
// → true

// → nên thực tế chạy:
// cmd.exe /c npm run preview -- --host 0.0.0.0

// 1.2. Trên Ubuntu VPS:
// process.platform === "win32"
// → false

// nên thực tế chạy:
// → npm run preview -- --host 0.0.0.0

// 2. Còn:
// cwd: __dirname

// có nghĩa:
// → Dù Windows hay Ubuntu, hãy chạy lệnh tại chính thư mục đang chứa ecosystem.config.cjs.

// Vì vậy không cần kiểu hard-code:
// cwd: "C:\\Users\\..."

// hay:
// cwd: "/home/user/project"

// 3. Điểm rất quan trọng
// 3.1. File phải giữ đuôi:
// ecosystem.config.cjs

// 3.2. đặc biệt nếu project của bạn có:
// {
//   "type": "module"
// }

// Vì .cjs nói với Node:
// File này là CommonJS.

// Do đó những thứ này dùng bình thường:
// module.exports
// process
// __dirname

// Nếu trước đó bạn gặp:

// __dirname is not defined
// process is not defined

// thì thường là do file đang bị IDE/ESLint/TypeScript hiểu sai environment, hoặc bạn dùng .js dưới "type": "module".

// Chốt: cấu hình trên phù hợp để dùng chung cho:

// Windows local
//         ↓
// ecosystem.config.cjs
//         ↑
// Ubuntu VPS

// và không cần tạo riêng ecosystem.windows.cjs / ecosystem.linux.cjs.

// Lấy ra tên môi trường tương ứng để tiện theo dõi trên pm2
const path = require("node:path");
// __dirname là folder frontend-nextjs
// path.dirname(__dirname) là folder environment
const environment = path.basename(path.dirname(__dirname));

const allowedEnvironments = ["development", "staging", "production"];

if (!allowedEnvironments.includes(environment)) {
  throw new Error(`Tên môi trường ${environment} không hợp lệ!`);
}

module.exports = {
  apps: [
    {
      name: `frontend_nextjs_${environment}`,

      // Windows cần cmd.exe.
      // Linux chạy npm trực tiếp.
      script: process.platform === "win32" ? "cmd.exe" : "npm",

      args:
        // Chú ý: ecosystem.config.cjs bản thân nó cũng là một deployment configuration, nên viết env: { PORT: 4000 } ở đó không sai.
        // -> Chỉ là nếu muốn một nguồn cấu hình duy nhất và dễ đổi Docker/PM2/Kubernetes sau này, thì để PORT được inject từ môi trường bên ngoài sẽ sạch hơn.
        process.platform === "win32" ? "/c npm run start" : "run start",

      // Chính là thư mục chứa file ecosystem.config.cjs.
      // Không cần hard-code đường dẫn Windows/Linux.
      cwd: __dirname,

      interpreter: "none",

      env: {
        PORT: process.env.PORT,
      },
    },
  ],
};
// Chú ý quan trọng:
// Chú ý 1: PM2 có khả năng thiết lập hoặc ghi đè các biến môi trường được truyền cho process mà nó khởi chạy.
// 1. Khi viết PORT: 3002
// env: {
//   PORT: 3002,
// }

// - PM2 nhận giá trị 3002 được khai báo cố định.
// - PM2 truyền PORT=3002 vào môi trường của process ứng dụng.
// - Ứng dụng đọc process.env.PORT → nhận được "3002".
// 2. Khi viết PORT: process.env.PORT
// env: {
//   PORT: process.env.PORT,
// }

// - Khi PM2 đọc file ecosystem, JavaScript lấy giá trị PORT từ môi trường của chính process đang đọc cấu hình.
// - Giả sử môi trường lúc đó có PORT=4000.
// - PM2 truyền PORT=4000 xuống process ứng dụng.
// - Ứng dụng đọc process.env.PORT → nhận được "4000".
// Điểm khác nhau: Trường hợp 1 bạn cố định giá trị PORT trong code cấu hình PM2. Trường hợp 2 bạn lấy PORT từ môi trường bên ngoài để cấu hình linh hoạt.
// 3. Có phải process luôn ưu tiên PM2?
// Không hoàn toàn. Ứng dụng mới là nơi quyết định cách sử dụng biến PORT.
// Ví dụ, nếu package.json của Next.js có:
// "start": "next start -p 5000"

// Thì dù PM2 truyền PORT=3002, Next.js vẫn lắng nghe tại cổng 5000, vì tham số -p được ưu tiên hơn biến môi trường PORT.
