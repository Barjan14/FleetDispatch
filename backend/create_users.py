import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

# Create admin user with provided credentials
if not User.objects.filter(username='DAR123').exists():
    User.objects.create_superuser('DAR123', 'admin@fleetdispatch.com', 'barjan123')
    print("✅ Admin user created: DAR123 / barjan123")
else:
    print("✅ Admin user already exists: DAR123")

# Create test users
test_users = [
    ('user1', 'user1@example.com', 'user123', 'Regular User 1'),
    ('driver1', 'driver1@example.com', 'driver123', 'Test Driver 1'),
    ('manager1', 'manager1@example.com', 'manager123', 'Fleet Manager'),
]

for username, email, password, name in test_users:
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(username, email, password)
        user.first_name = name.split()[0]
        user.last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
        user.save()
        print(f"✅ Test user created: {username} / {password}")
    else:
        print(f"✅ Test user already exists: {username}")

print("\n" + "="*50)
print("🎉 All users ready for testing!")
print("="*50)
print("\n📋 ADMIN LOGIN CREDENTIALS:")
print("   Username: DAR123")
print("   Password: barjan123")
print("\n📋 TEST USER CREDENTIALS:")
print("   Username: user1")
print("   Password: user123")
print("\n📋 FLEET MANAGER CREDENTIALS:")
print("   Username: manager1")
print("   Password: manager123")
print("="*50)
