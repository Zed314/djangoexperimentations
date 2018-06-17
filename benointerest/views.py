from django.shortcuts import render
from .forms import MemeForm
from .models import Meme
from django.views.generic import ListView, DetailView
# Create your views here.

class ListMemes(ListView):
    model=Meme
    context_object_name="memes"
    template_name="benointerest/accueil.html"

class SeeMeme(DetailView):
    model=Meme
    context_object_name="meme"
    template_name="benointerest/explore.html"

def sendmemes(request):
    # Construire le formulaire, soit avec les données postées,
    # soit vide si l'utilisateur accède pour la première fois
    # à la page.
    form = MemeForm(request.POST or None, request.FILES)
    # Nous vérifions que les données envoyées sont valides
    # Cette méthode renvoie False s'il n'y a pas de données 
    # dans le formulaire ou qu'il contient des erreurs.
    if form.is_valid(): 
        # Ici nous pouvons traiter les données du formulaire
        titre = form.cleaned_data['titre']
        auteur = form.cleaned_data['auteur']
        image = form.cleaned_data["image"]
        Meme(titre=titre, auteur=auteur, image=image).save()
        form.save()
        envoi = True
    
    # Quoiqu'il arrive, on affiche la page du formulaire.
    return render(request, 'benointerest/sendmemes.html', locals())