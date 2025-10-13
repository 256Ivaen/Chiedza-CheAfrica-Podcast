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
    <title>Welcome to Blog System</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Blog System</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Your Account Has Been Created</h2>
                            
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                                You've been invited to join Blog System as a <strong>{$role}</strong>. Below are your login credentials:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 10px 0; color: #666666;"><strong>Email:</strong></p>
                                        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px;">{$email}</p>
                                        
                                        <p style="margin: 0 0 10px 0; color: #666666;"><strong>Temporary Password:</strong></p>
                                        <p style="margin: 0; color: #333333; font-size: 16px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">{$tempPassword}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                                <strong style="color: #dc3545;">Important:</strong> Please change your password after your first login for security purposes.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{$appUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: bold; font-size: 16px;">Login Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="color: #999999; font-size: 14px; margin: 0 0 10px 0;">
                                If you didn't expect this email, please ignore it.
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                &copy; 2025 Blog System. All rights reserved.
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