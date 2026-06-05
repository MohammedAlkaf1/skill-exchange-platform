"""
Run: py manage.py shell < seed_data.py
Or:  py seed_data.py  (from backend directory)
"""
import os
import sys
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skill_exchange.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.accounts.models import User
from apps.skills.models import Skill
from apps.exchanges.models import ExchangeRequest
from apps.reviews.models import Review
from apps.notifications.models import Notification

print("Clearing existing data...")
Review.objects.all().delete()
Notification.objects.all().delete()
ExchangeRequest.objects.all().delete()
Skill.objects.all().delete()
User.objects.filter(is_superuser=False).delete()

print("Creating users...")
users_data = [
    {'email': 'ahmed@example.com', 'username': 'ahmed_dev', 'full_name': 'Ahmed Al-Rashidi', 'location': 'Dubai, UAE', 'bio': 'Full-stack web developer passionate about building great products.', 'availability': 'available'},
    {'email': 'sara@example.com', 'username': 'sara_design', 'full_name': 'Sara Hassan', 'location': 'Cairo, Egypt', 'bio': 'Creative graphic designer with 5 years of experience in branding.', 'availability': 'available'},
    {'email': 'mohammed@example.com', 'username': 'mo_video', 'full_name': 'Mohammed Al-Farsi', 'location': 'Riyadh, Saudi Arabia', 'bio': 'Video editor and content creator specializing in YouTube videos.', 'availability': 'weekends_only'},
    {'email': 'lina@example.com', 'username': 'lina_english', 'full_name': 'Lina Chen', 'location': 'Shanghai, China', 'bio': 'Certified English tutor with 8 years of teaching experience.', 'availability': 'available'},
    {'email': 'omar@example.com', 'username': 'omar_data', 'full_name': 'Omar Abdullah', 'location': 'Amman, Jordan', 'bio': 'Data analyst and Python enthusiast. I love turning data into insights.', 'availability': 'available'},
    {'email': 'fatima@example.com', 'username': 'fatima_photo', 'full_name': 'Fatima Malik', 'location': 'Karachi, Pakistan', 'bio': 'Professional photographer specializing in portraits and events.', 'availability': 'weekends_only'},
    {'email': 'yusuf@example.com', 'username': 'yusuf_music', 'full_name': 'Yusuf Al-Amin', 'location': 'Istanbul, Turkey', 'bio': 'Music producer and guitar teacher with a passion for jazz.', 'availability': 'available'},
    {'email': 'nadia@example.com', 'username': 'nadia_market', 'full_name': 'Nadia Rousseau', 'location': 'Paris, France', 'bio': 'Digital marketing expert with expertise in SEO and social media.', 'availability': 'available'},
    {'email': 'khalid@example.com', 'username': 'khalid_ui', 'full_name': 'Khalid Al-Mansouri', 'location': 'Abu Dhabi, UAE', 'bio': 'UI/UX designer focused on creating beautiful user experiences.', 'availability': 'busy'},
    {'email': 'aisha@example.com', 'username': 'aisha_write', 'full_name': 'Aisha Johnson', 'location': 'London, UK', 'bio': 'Content writer and copywriter specializing in tech and finance.', 'availability': 'available'},
]

users = []
for data in users_data:
    user = User.objects.create_user(password='Password123!', **data)
    users.append(user)
    print(f"  Created user: {user.username}")

ahmed, sara, mohammed, lina, omar, fatima, yusuf, nadia, khalid, aisha = users

print("Creating skills...")
skills_data = [
    # Ahmed - Web Developer
    (ahmed, 'Web Development', 'programming', 'offered', 'expert', 'Full-stack web development with React and Django.'),
    (ahmed, 'Python Programming', 'programming', 'offered', 'advanced', 'Backend development, scripts, automation.'),
    (ahmed, 'Graphic Design', 'graphic_design', 'wanted', 'beginner', 'Looking to learn logo and brand design basics.'),
    # Sara - Graphic Designer
    (sara, 'Logo Design', 'graphic_design', 'offered', 'expert', 'Professional logo and branding design.'),
    (sara, 'Graphic Design', 'graphic_design', 'offered', 'advanced', 'Print and digital design for all purposes.'),
    (sara, 'English Practice', 'languages', 'wanted', 'beginner', 'Want to improve my conversational English.'),
    (sara, 'Web Development', 'programming', 'wanted', 'beginner', 'Basic HTML/CSS knowledge to build simple websites.'),
    # Mohammed - Video Editor
    (mohammed, 'Video Editing', 'video_editing', 'offered', 'advanced', 'YouTube video editing, color grading, motion graphics.'),
    (mohammed, 'Marketing', 'marketing', 'wanted', 'intermediate', 'Want to learn digital marketing for my channel.'),
    # Lina - English Teacher
    (lina, 'English Tutoring', 'languages', 'offered', 'expert', 'English for all levels, conversation, grammar, IELTS prep.'),
    (lina, 'Web Development', 'programming', 'wanted', 'beginner', 'Want to build my own teaching website.'),
    # Omar - Data Analyst
    (omar, 'Data Analysis', 'data_analysis', 'offered', 'advanced', 'Data analysis with Python, Pandas, visualization.'),
    (omar, 'UI/UX Design', 'ui_ux_design', 'wanted', 'beginner', 'Want to improve my dashboards with good UX.'),
    # Fatima - Photographer
    (fatima, 'Photography', 'photography', 'offered', 'expert', 'Portrait and event photography, photo editing.'),
    (fatima, 'Social Media', 'social_media', 'wanted', 'intermediate', 'Looking to grow my photography business online.'),
    # Yusuf - Music
    (yusuf, 'Music Production', 'music', 'offered', 'advanced', 'Beat making, mixing, mastering for various genres.'),
    (yusuf, 'Guitar Lessons', 'music', 'offered', 'expert', 'Guitar for all levels, jazz, classical, pop.'),
    (yusuf, 'Video Editing', 'video_editing', 'wanted', 'beginner', 'Want to create music videos for my tracks.'),
    # Nadia - Digital Marketing
    (nadia, 'Digital Marketing', 'marketing', 'offered', 'expert', 'SEO, Google Ads, Facebook Ads, content strategy.'),
    (nadia, 'Social Media', 'social_media', 'offered', 'advanced', 'Social media management for brands and influencers.'),
    (nadia, 'Photography', 'photography', 'wanted', 'beginner', 'Need product photography for client campaigns.'),
    # Khalid - UI/UX
    (khalid, 'UI/UX Design', 'ui_ux_design', 'offered', 'expert', 'User research, wireframing, prototyping in Figma.'),
    (khalid, 'Data Analysis', 'data_analysis', 'wanted', 'beginner', 'Want to understand user analytics better.'),
    # Aisha - Writer
    (aisha, 'Content Writing', 'writing', 'offered', 'expert', 'Blog posts, articles, website copy, technical writing.'),
    (aisha, 'Social Media', 'social_media', 'offered', 'advanced', 'Social media content creation and strategy.'),
    (aisha, 'Graphic Design', 'graphic_design', 'wanted', 'intermediate', 'Need design skills for creating visual content.'),
]

skills = []
for user, name, category, stype, level, desc in skills_data:
    skill = Skill.objects.create(user=user, name=name, category=category, skill_type=stype, level=level, description=desc)
    skills.append(skill)

print(f"  Created {len(skills)} skills")

# Helper to get skills by user and type
def get_skill(user, stype):
    return Skill.objects.filter(user=user, skill_type=stype).first()

print("Creating exchange requests...")
exchanges_data = [
    # Completed exchanges
    (ahmed, sara, get_skill(sara, 'offered'), get_skill(ahmed, 'offered'), 'Hi Sara! I would love your help with logo design. I can help you with web dev!', 'completed'),
    (lina, ahmed, get_skill(ahmed, 'offered'), get_skill(lina, 'offered'), 'I want to build my tutoring website. Can you help?', 'completed'),
    (sara, lina, get_skill(lina, 'offered'), get_skill(sara, 'offered'), 'Hi Lina! I want to improve my English conversation.', 'completed'),
    (omar, khalid, get_skill(khalid, 'offered'), get_skill(omar, 'offered'), 'I need help improving my dashboard UX.', 'completed'),
    (mohammed, nadia, get_skill(nadia, 'offered'), get_skill(mohammed, 'offered'), 'Want to learn digital marketing for my channel.', 'completed'),
    (fatima, nadia, get_skill(nadia, 'offered'), get_skill(fatima, 'offered'), 'I need to grow my photography social media presence.', 'completed'),
    (yusuf, mohammed, get_skill(mohammed, 'offered'), get_skill(yusuf, 'offered'), 'I want to create a music video for my new song.', 'completed'),
    (aisha, sara, get_skill(sara, 'offered'), get_skill(aisha, 'offered'), 'I need help with visual design for my articles.', 'completed'),
    # Active exchanges
    (khalid, aisha, get_skill(aisha, 'offered'), get_skill(khalid, 'offered'), 'Can you write UX case studies for my portfolio?', 'accepted'),
    (nadia, fatima, get_skill(fatima, 'offered'), get_skill(nadia, 'offered'), 'I need product photos for a campaign.', 'pending'),
    (omar, ahmed, get_skill(ahmed, 'offered'), get_skill(omar, 'offered'), 'Want to build a data visualization web app.', 'pending'),
    (yusuf, aisha, get_skill(aisha, 'offered'), get_skill(yusuf, 'offered'), 'I need help writing song descriptions and press releases.', 'rejected'),
]

exchange_objects = []
for sender, receiver, req_skill, off_skill, msg, st in exchanges_data:
    ex = ExchangeRequest.objects.create(
        sender=sender,
        receiver=receiver,
        requested_skill=req_skill,
        offered_skill=off_skill,
        message=msg,
        status=st,
    )
    if st == 'completed':
        ex.completed_at = timezone.now()
        ex.save()
        sender.completed_exchanges_count += 1
        sender.save(update_fields=['completed_exchanges_count'])
        receiver.completed_exchanges_count += 1
        receiver.save(update_fields=['completed_exchanges_count'])
    exchange_objects.append(ex)

print(f"  Created {len(exchange_objects)} exchange requests")

print("Creating reviews...")
completed = [ex for ex in exchange_objects if ex.status == 'completed']
reviews_raw = [
    (completed[0], ahmed, sara, 5, 'Sara did an amazing job with my logo! Very professional and creative.'),
    (completed[0], sara, ahmed, 4, 'Ahmed helped me understand web basics. Very patient and knowledgeable.'),
    (completed[1], lina, ahmed, 5, 'Ahmed built me a beautiful tutoring website. Highly recommended!'),
    (completed[1], ahmed, lina, 5, 'Lina is an excellent teacher. My English improved significantly.'),
    (completed[2], sara, lina, 5, 'Lina is a wonderful teacher. I feel much more confident in English now.'),
    (completed[2], lina, sara, 4, 'Sara designed beautiful graphics for my teaching materials.'),
    (completed[3], omar, khalid, 5, 'Khalid redesigned my dashboard and it looks amazing now!'),
    (completed[3], khalid, omar, 5, 'Omar provided great data analysis insights for my UX research.'),
    (completed[4], mohammed, nadia, 4, 'Nadia gave me excellent marketing tips. My channel grew by 20%!'),
    (completed[4], nadia, mohammed, 4, 'Mohammed edited my promotional videos perfectly.'),
    (completed[5], fatima, nadia, 5, 'Nadia is a social media genius. My Instagram followers doubled!'),
    (completed[6], yusuf, mohammed, 5, 'Mohammed created a stunning music video for my song!'),
    (completed[7], aisha, sara, 5, 'Sara designed beautiful visuals for my articles. Incredible work!'),
    (completed[7], sara, aisha, 4, 'Aisha is a talented writer. She created great content for my portfolio.'),
]

for ex, reviewer, reviewed, rating, feedback in reviews_raw:
    Review.objects.create(
        exchange_request=ex,
        reviewer=reviewer,
        reviewed_user=reviewed,
        rating=rating,
        feedback=feedback,
    )

print(f"  Created {len(reviews_raw)} reviews")

print("Recalculating reputation scores...")
for user in users:
    user.refresh_from_db()
    user.recalculate_reputation()
    print(f"  {user.username}: score={user.reputation_score}, level={user.get_reputation_level()}")

print("Creating sample notifications...")
for user in users:
    Notification.objects.create(
        user=user,
        title='Welcome to Skill Exchange!',
        message='Welcome to the platform. Start by adding your skills and exploring others.',
        is_read=False,
    )

print("\nSeed data created successfully!")
print("\nTest Accounts (password: Password123!):")
for user in users:
    print(f"  Email: {user.email} | Username: {user.username}")
