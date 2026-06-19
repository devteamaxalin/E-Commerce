from celery_app import celery
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, HtmlContent, Subject, From, To

@celery.task
def send_welcome_email(recipient_email, username, sender_email, sendgrid_api_key):
    """
    Sends an onboarding email dynamically using SendGrid's API client.
    """
    try:
        # 1. Design the HTML Content
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #4F46E5; text-align: center;">Welcome aboard, {username}!</h2>
                    <p>Thank you for creating an account with us. Your registration was successful.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/login" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # 2. Construct the SendGrid Mail Object
        message = Mail(
            from_email=From(sender_email),
            to_emails=To(recipient_email),
            subject=Subject("🎉 Welcome to our Ecommerce Family!"),
            html_content=HtmlContent(html_body)
        )

        # 3. Authenticate and send via the user's dynamic SendGrid Key
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        
        return f"SendGrid Success: Status Code {response.status_code} from {sender_email} to {recipient_email}"
        
    except Exception as e:
        return f"SendGrid Failed to send welcome email from {sender_email}: {str(e)}"


@celery.task
def send_order_confirmation_email(recipient_email, username, order_id, total_amount, items, sender_email, sendgrid_api_key):
    """
    Sends a structured order invoice table dynamically using SendGrid's API client.
    """
    try:
        item_rows = ""
        for item in items:
            item_rows += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.get('name')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">%s{item.get('price'):,.2f}</td>
            </tr>
            """ % "₹"

        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #10B981; margin-bottom: 5px;">Order Placed Successfully!</h2>
                        <p style="color: #666; margin-top: 0;">Thank you for your purchase, {username}.</p>
                    </div>
                    <h3 style="border-bottom: 2px solid #10B981; padding-bottom: 5px;">Invoice Summary (Order #{order_id})</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background-color: #f3f4f6;">
                                <th style="padding: 10px; text-align: left;">Item Name</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item_rows}
                            <tr style="font-weight: bold; font-size: 16px;">
                                <td colspan="2" style="padding: 15px 10px 10px 10px; text-align: right;">Grand Total:</td>
                                <td style="padding: 15px 10px 10px 10px; text-align: right; color: #10B981;">₹{total_amount:,.2f}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
        """

        message = Mail(
            from_email=From(sender_email),
            to_emails=To(recipient_email),
            subject=Subject(f"🛍️ Order Confirmed! Invoice for Order #{order_id}"),
            html_content=HtmlContent(html_body)
        )

        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        return f"SendGrid Invoice Success: Status Code {response.status_code} for Order #{order_id}"
        
    except Exception as e:
        return f"SendGrid Invoice Failed from {sender_email}: {str(e)}"