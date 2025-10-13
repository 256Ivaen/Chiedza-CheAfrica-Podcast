<?php

namespace App\Utils;

class Email {
    private static $config;

    private static function init() {
        self::$config = [
            'host' => $_ENV['SMTP_HOST'],
            'port' => $_ENV['SMTP_PORT'],
            'username' => $_ENV['SMTP_USER'],
            'password' => $_ENV['SMTP_PASS'],
            'from' => $_ENV['SMTP_FROM'],
            'from_name' => $_ENV['SMTP_FROM_NAME']
        ];
    }

    private static function sendSMTP($to, $subject, $body) {
        self::init();

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . self::$config['from_name'] . " <" . self::$config['from'] . ">\r\n";

        $socket = @fsockopen(self::$config['host'], self::$config['port'], $errno, $errstr, 30);
        
        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }

        try {
            self::readResponse($socket);
            
            fwrite($socket, "EHLO " . self::$config['host'] . "\r\n");
            self::readResponse($socket);
            
            fwrite($socket, "STARTTLS\r\n");
            self::readResponse($socket);
            
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            
            fwrite($socket, "EHLO " . self::$config['host'] . "\r\n");
            self::readResponse($socket);
            
            fwrite($socket, "AUTH LOGIN\r\n");
            self::readResponse($socket);
            
            fwrite($socket, base64_encode(self::$config['username']) . "\r\n");
            self::readResponse($socket);
            
            fwrite($socket, base64_encode(self::$config['password']) . "\r\n");
            self::readResponse($socket);
            
            fwrite($socket, "MAIL FROM: <" . self::$config['from'] . ">\r\n");
            self::readResponse($socket);
            
            fwrite($socket, "RCPT TO: <$to>\r\n");
            self::readResponse($socket);
            
            fwrite($socket, "DATA\r\n");
            self::readResponse($socket);
            
            $message = "Subject: $subject\r\n";
            $message .= $headers . "\r\n";
            $message .= $body . "\r\n.\r\n";
            
            fwrite($socket, $message);
            self::readResponse($socket);
            
            fwrite($socket, "QUIT\r\n");
            self::readResponse($socket);
            
            fclose($socket);
            return true;
            
        } catch (\Exception $e) {
            error_log("SMTP Error: " . $e->getMessage());
            fclose($socket);
            return false;
        }
    }

    private static function readResponse($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $response;
    }

    public static function sendInvitation($email, $tempPassword, $role) {
        $subject = "Welcome to Blog System - Your Account Details";
        
        $body = self::getInvitationTemplate($email, $tempPassword, $role);
        
        return self::sendSMTP($email, $subject, $body);
    }

    private static function getInvitationTemplate($email, $tempPassword, $role) {
        $appUrl = $_ENV['APP_URL'];
        
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chiedza CheAfrica Podcast</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0a0a0a; padding: 40px 30px; text-align: center; border-bottom: 3px solid #edab12;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">CHIEDZA CHEAFRICA PODCAST</h1>
                            <p style="color: #edab12; margin: 10px 0 0 0; font-size: 14px; font-weight: 300; letter-spacing: 0.5px;">Lighting paths. Inspiring minds. Amplifying African stories.</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #0a0a0a; margin: 0 0 25px 0; font-size: 20px; font-weight: 400; letter-spacing: 0.5px;">Welcome to Our Platform</h2>
                            
                            <p style="color: #666666; line-height: 1.7; margin: 0 0 25px 0; font-size: 15px;">
                                You've been invited to join the Chiedza CheAfrica Podcast platform as a <strong style="color: #0a0a0a;">{$role}</strong>. We're excited to have you as part of our mission to amplify African stories of innovation, courage, and purpose.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-left: 4px solid #edab12; padding: 25px; margin: 30px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">EMAIL ADDRESS</p>
                                        <p style="margin: 0 0 25px 0; color: #0a0a0a; font-size: 16px; font-weight: 400;">{$email}</p>
                                        
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">TEMPORARY PASSWORD</p>
                                        <p style="margin: 0; color: #0a0a0a; font-size: 16px; font-weight: 400; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px; border: 1px solid #e8e8e8;">{$tempPassword}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; line-height: 1.7; margin: 25px 0; font-size: 14px;">
                                <strong style="color: #0a0a0a;">Security Note:</strong> For your account security, please change your password after your first login.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://chiedzacheafrica.com/login" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 45px; border: 1px solid #0a0a0a; font-weight: 400; font-size: 14px; letter-spacing: 0.5px; transition: all 0.3s ease;">ACCESS PLATFORM</a>
                                    </td>
                                </tr>
                            </table>

                            <div style="border-top: 1px solid #e8e8e8; padding-top: 30px; margin-top: 30px;">
                                <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0 0 15px 0;">
                                    <strong>About Chiedza CheAfrica:</strong> A global podcast and movement celebrating Africa's ascent through stories of courage, innovation, and purpose. We spotlight changemakers across aviation, STEM, disability inclusion, mental health, and community empowerment.
                                </p>
                                <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0;">
                                    Explore our content: 
                                    <a href="https://chiedzacheafrica.com" style="color: #edab12; text-decoration: none;">Website</a> • 
                                    <a href="https://youtube.com/@chiedzacheafrica" style="color: #edab12; text-decoration: none;">YouTube</a> • 
                                    <a href="https://open.spotify.com/show/5YBekTISDE8CawmkxGiesr" style="color: #edab12; text-decoration: none;">Spotify</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e8e8e8;">
                            <p style="color: #999999; font-size: 12px; margin: 0 0 8px 0; line-height: 1.4;">
                                If you did not expect this invitation, please disregard this email.
                            </p>
                            <p style="color: #999999; font-size: 11px; margin: 0; line-height: 1.4;">
                                &copy; 2024 Chiedza CheAfrica Podcast. All rights reserved.<br>
                                Lighting Africa's Path Through Stories of Innovation & Impact
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}