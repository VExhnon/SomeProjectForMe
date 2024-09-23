from django.shortcuts import render

def portfolio_view(request):
    context = {
        'full_name': 'Ваше ФИО',  # Ваше ФИО
        'about_me': 'Здесь краткая информация о вас. Например, ваш опыт, увлечения и т.д.',  # О себе
        'skills': ['Python', 'CSS', 'JavaScript', 'Django'],  # Навыки и технологии
        'languages': [
            ('Python', 'Продвинутый'),  # Язык и уровень знания
            ('JavaScript', 'Средний'),
            ('Django', 'Продвинутый'),
            ('React', 'Начальный'),
        ],
        'github_url': 'https://github.com/yourgithubusername',  # Ваша ссылка на GitHub
    }
    return render(request, 'portfolio/portfolio.html', context)
