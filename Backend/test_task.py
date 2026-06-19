from task import send_order_email

result = send_order_email.delay(1001)

print(result.id)