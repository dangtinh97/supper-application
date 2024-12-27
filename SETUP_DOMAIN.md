Để cấu hình domain tool.myoupip.com chạy HTTPS với server AWS đang chạy HTTP trên port 3000, bạn có thể làm theo các bước sau:

1. Cấu hình DNS
   Truy cập vào quản lý DNS của domain (ví dụ: Namecheap, Cloudflare, GoDaddy, v.v.) và tạo bản ghi A trỏ đến địa chỉ IP của server AWS.

Type: A
Name: tool.myoupip.com
Value: Địa chỉ IP public của server AWS.
2. Cài đặt Nginx làm reverse proxy
   Nginx sẽ làm reverse proxy để chuyển hướng yêu cầu HTTPS đến ứng dụng chạy ở port 3000.

2.1 Cài đặt Nginx
Trên server AWS, cài đặt Nginx:

```sudo apt update```

```sudo apt install nginx -y```

2.2 Cấu hình Nginx
Tạo file cấu hình cho domain tool.myoupip.com:

```
sudo nano /etc/nginx/sites-available/tool.myoupip.com
```

Thêm nội dung sau:

nginx
Copy code
```
server{
    listen 80;
    server_name tool.myoupip.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Kích hoạt cấu hình:
```sudo ln -s /etc/nginx/sites-available/tool.myoupip.com /etc/nginx/sites-enabled/```

```sudo nginx -t```

```sudo systemctl reload nginx```

### Cài đặt HTTPS với Let's Encrypt
   3.1 Cài đặt Certbot
   ```sudo apt install certbot python3-certbot-nginx -y```
5. 
   3.2 Cấp SSL cho domain
   Chạy lệnh sau để tự động cấp và cấu hình SSL:

bash
Copy code

```sudo certbot --nginx -d tool.myoupip.com```

Certbot sẽ yêu cầu bạn:

Xác nhận domain.
Tự động chuyển hướng HTTP sang HTTPS.
Sau khi thành công, Nginx sẽ được cập nhật với cấu hình HTTPS.

4. Kiểm tra và hoàn tất
   Mở trình duyệt và truy cập: https://tool.myoupip.com.
   Đảm bảo ứng dụng chạy ổn định.
5. Gia hạn SSL tự động
   Certbot tự động gia hạn SSL. Để kiểm tra, chạy:

bash
Copy code
sudo certbot renew --dry-run
