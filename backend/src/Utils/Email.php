<?php

namespace App\Utils;

class Email {
    
    private static function sendEmailViaAPI($to, $subject, $body) {
        $url = 'https://mail.chiedzacheafrica.com/api.php';
        $apiKey = $_ENV['APX_API'] ?? '';
        
        $payload = json_encode([
            'to' => $to,
            'subject' => $subject,
            'body' => $body
        ]);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'X-Api-Key: ' . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($httpCode !== 200 || $curlError) {
            error_log("Email API Failed - HTTP: {$httpCode} | Error: {$curlError} | Response: {$response}");
            return false;
        }
        
        return true;
    }

    public static function sendInvitation($email, $tempPassword, $role) {
        $subject = "Welcome to Chiedza CheAfrica Podcast - Your Account Details";
        
        $body = self::getInvitationTemplate($email, $tempPassword, $role);
        
        return self::sendEmailViaAPI($email, $subject, $body);
    }

    public static function sendContactForm($to, $subject, $body) {
        return self::sendEmailViaAPI($to, $subject, $body);
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
                                        <a href="https://admin.chiedzacheafrica.com/login" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 14px 45px; border: 1px solid #0a0a0a; font-weight: 400; font-size: 14px; letter-spacing: 0.5px; transition: all 0.3s ease;">ACCESS PLATFORM</a>
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
                                    <a href="https://youtube.com/@chiedzacheafrica" style="color: #edab12; text-decoration: none;">YouTube</a> 
                                    <!-- <a href="https://open.spotify.com/show/5YBekTISDE8CawmkxGiesr" style="color: #edab12; text-decoration: none;">Spotify</a> -->
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
                                &copy; <span id="year"></span> Chiedza CheAfrica Podcast. All rights reserved.<br>
                                Lighting Africa's Path Through Stories of Innovation & Impact
                                </p>

                                <script>
                                document.getElementById("year").textContent = new Date().getFullYear();
                                </script>
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

    public static function getContactFormTemplate($name, $email, $subject, $message) {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
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
                            <p style="color: #edab12; margin: 10px 0 0 0; font-size: 14px; font-weight: 300; letter-spacing: 0.5px;">New Contact Form Submission</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #0a0a0a; margin: 0 0 25px 0; font-size: 20px; font-weight: 400; letter-spacing: 0.5px;">You have a new message</h2>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-left: 4px solid #edab12; padding: 25px; margin: 30px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">FROM NAME</p>
                                        <p style="margin: 0 0 25px 0; color: #0a0a0a; font-size: 16px; font-weight: 400;">{$name}</p>
                                        
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">EMAIL ADDRESS</p>
                                        <p style="margin: 0 0 25px 0; color: #0a0a0a; font-size: 16px; font-weight: 400;">{$email}</p>
                                        
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">SUBJECT</p>
                                        <p style="margin: 0 0 25px 0; color: #0a0a0a; font-size: 16px; font-weight: 400;">{$subject}</p>
                                        
                                        <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 500;">MESSAGE</p>
                                        <p style="margin: 0; color: #0a0a0a; font-size: 16px; font-weight: 400; line-height: 1.6; background-color: #ffffff; padding: 12px; border: 1px solid #e8e8e8;">{$message}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; line-height: 1.7; margin: 25px 0; font-size: 14px;">
                                <strong style="color: #0a0a0a;">Response Required:</strong> Please respond to this inquiry within 24-48 hours.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e8e8e8;">
                            <p style="color: #999999; font-size: 11px; margin: 0; line-height: 1.4;">
                                &copy; <span id="year"></span> Chiedza CheAfrica Podcast. All rights reserved.<br>
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

    public static function getConfirmationTemplate($name) {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us</title>
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
                            <p style="color: #edab12; margin: 10px 0 0 0; font-size: 14px; font-weight: 300; letter-spacing: 0.5px;">Thank You for Reaching Out</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #0a0a0a; margin: 0 0 25px 0; font-size: 20px; font-weight: 400; letter-spacing: 0.5px;">Hello {$name},</h2>
                            
                            <p style="color: #666666; line-height: 1.7; margin: 0 0 25px 0; font-size: 15px;">
                                Thank you for contacting Chiedza CheAfrica Podcast! We've received your message and appreciate you taking the time to reach out to us.
                            </p>
                            
                            <p style="color: #666666; line-height: 1.7; margin: 0 0 25px 0; font-size: 15px;">
                                Our team will review your inquiry and get back to you within <strong style="color: #0a0a0a;">24-48 hours</strong>. We're excited to connect with you and explore how we can work together to amplify African stories.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-left: 4px solid #edab12; padding: 25px; margin: 30px 0;">
                                <tr>
                                    <td>
                                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                                            <strong>What's Next?</strong><br>
                                            • We'll review your message carefully<br>
                                            • Our team will discuss your inquiry<br>
                                            • We'll respond with thoughtful feedback<br>
                                            • Let's explore collaboration opportunities
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <div style="border-top: 1px solid #e8e8e8; padding-top: 30px; margin-top: 30px;">
                                <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0 0 15px 0;">
                                    <strong>In the meantime:</strong> Explore our latest episodes and stories across our platforms.
                                </p>
                                <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0;">
                                    Explore our content: 
                                    <a href="https://chiedzacheafrica.com" style="color: #edab12; text-decoration: none;">Website</a> • 
                                    <a href="https://youtube.com/@chiedzacheafrica" style="color: #edab12; text-decoration: none;">YouTube</a> 
                                    <!-- <a href="https://open.spotify.com/show/5YBekTISDE8CawmkxGiesr" style="color: #edab12; text-decoration: none;">Spotify</a> -->
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e8e8e8;">
                            <p style="color: #999999; font-size: 12px; margin: 0 0 8px 0; line-height: 1.4;">
                                This is an automated confirmation. Please do not reply to this email.
                            </p>
                            <p style="color: #999999; font-size: 11px; margin: 0; line-height: 1.4;">
                                &copy; <span id="year"></span> Chiedza CheAfrica Podcast. All rights reserved.<br>
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