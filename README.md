# caniwalkAngular
This repo will house the CanIWalk Angular app

# `Can <i> walk?`

# when naming variables, use 'trip' instead of 'route' or 'path' #

# Your local gitignore on each branch should include: #

###.gitignore###   
###assets/css/.sass-cache/###   
###assets/css/styles.css.map###   

## Potential Fonts:

[Oswald](https://www.google.com/fonts/specimen/Oswald)  
[Dosis](https://www.google.com/fonts/specimen/Dosis)  

## Color Scheme:

[First Find](https://coolors.co/app/353535-3c6e71-ffffff-d9d9d9-284b63) dark green, blue, a dark gray, light gray, off white  
[Second Find](https://coolors.co/app/43adf5-0072bc-2c2429-8fe276-616661) two blues, two grays, accent green  
[Third Find](https://coolors.co/app/17bebb-2e282a-cd5334-edb88b-fad8d6) dark gray, turquoise, red, pink, and tan  
[Fourth Find](https://coolors.co/app/fe938c-e6b89c-ead2ac-9cafb7-4281a4), lots of pastels  
[Fifth](https://coolors.co/app/252f15-1f4a0c-db3a3e-4ea2be-57dddd), I like this green a lot, the rest...hmmm. Not bad.  
[Sixth](https://coolors.co/app/e4572e-17bebb-ffc914-2e282a-76b041) stoplighty colors  

**Greg:** Hi Guys! I like the second and the Third better. [This](https://coolors.co/) site is pretty cool, and I've been getting a lot of my colors from them recently.

## Style Guide:

- For a Button

```
<button class="btn"><button>
```

```
.btn {
   background-color: $Button-Color;
   color: $Secondary-Font-Color;
   border: 3px solid $Button-Color;
   border-radius: 3px;
}
```

- For a link

```
<a href="#"></a>
```

```
a {
   text-decoration: none;
   color: $Primary-Font-Color;
}

a:hover {
   text-decoration: underline;
}
```
## Font Awesome Icons:

For accessibility: [Wheelchair](http://fortawesome.github.io/Font-Awesome/icon/wheelchair/)  
For Enjoyability: [Smiley Face](http://fortawesome.github.io/Font-Awesome/icon/smile-o/)  
For


## Wireframe workflow:

Login Page needs proceed as guest functionality, and sign up modal pops from this page.
* We don't really need athletic level - that's kinda not really needed.
* We're going to have accessibility info worked into the rating system. It'll be unobtrusive to those who don't need accessibility options.
* Lets separate needs accessibility ratings and don't need accessibility ratings.

Items on Login Page:

1. Header
2. Google Sign in bt

From login page navigate to plan a walk page.
