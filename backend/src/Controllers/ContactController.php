<?php

namespace App\Controllers;

use App\Utils\Response;
use App\Utils\Email;

class ContactController {
    
    public function submit($data) {
        try {
            // Validate required fields
            $required = ['name', 'email', 'subject', 'message'];
            foreach ($required as $field) {
                if (empty(trim($data[$field] ?? ''))) {
                    Response::error("Field '$field' is required", 400);
                }
            }

            $name = trim($data['name']);
            $email = trim($data['email']);
            $subject = trim($data['subject']);
            $message = trim($data['message']);

            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Response::error('Invalid email format', 400);
            }

            // Sanitize inputs
            $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
            $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
            $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

            // Send email to admin
            $adminEmail = 'hello@chiedzacheafrica.com';
            $emailSubject = "Contact Form: " . $subject;
            $emailBody = Email::getContactFormTemplate($name, $email, $subject, $message);

            $emailSent = Email::sendContactForm($adminEmail, $emailSubject, $emailBody);

            if ($emailSent) {
                // Also send confirmation email to user
                $userConfirmationSubject = "Thank you for contacting Chiedza CheAfrica";
                $userConfirmationBody = Email::getConfirmationTemplate($name);
                
                Email::sendContactForm($email, $userConfirmationSubject, $userConfirmationBody);

                Response::success(['message' => 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.']);
            } else {
                Response::error('Failed to send email. Please try again or email us directly at hello@chiedzacheafrica.com', 500);
            }

        } catch (Exception $e) {
            error_log("Contact form error: " . $e->getMessage());
            Response::error('An unexpected error occurred. Please try again later.', 500);
        }
    }
}