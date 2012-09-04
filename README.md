UrbanOutfitters.co.uk
=============

Remote repositroy for templates and certain resources behind Urban Outfitters' european website. All development work to be controlled and centrally stored here.

UAT - <http://urbanoutfitters.uat.venda.com>
Live - <http://www.urbanoutfitters.co.uk>

Development tasks split out in pivotal tracker project, work from the top down on outstanding issues assigned to you.

[Urban Outfitters Pivotal Tracker Project](https://www.pivotaltracker.com/projects/616063 "Pivotal Tracker Project")

Top level directories
------------

* resources
	* js
	* css
* templates
	* subdirectories for all available templates
	
Note that we have ignored current images, flash and other large files in our commits. We will add in new images were applicable.

Guidelines
------------

- Install git-ftp, this will be used to manage the upload process over ftp, default to UAT and add a scope for Live. Some bespoke configuration needed to place hash in a write access location.

Workflow
------------

1. `git pull origin master` => Pull in the latest code to your local machine.
2. `git checkout -b *new-branch-name*` => Create a new branch where you commit new code, branch should correspond to a tracker task.
3. Start coding, make changes, add templates etc.
4. `git diff` => Verify that the changes you've made are correct.
5. `git add .` => Stage changed files for commiting.
6. `git commit -m "Sensible message describing changes"` => Commit code changes to your branch. Append story id from pivotal tracker to the beginning of a commit i.e. "[#1234] Site redesigned" to automatically comment in tracker on push to origin master.
7. `git push origin *new-branch-name*` => Push branch up into github, when all your code is done and dusted.
8. Log into github and send a pull request from your new branch into master. Get other developers to review your changes and make ammendments if needed.
9. Once signed off, go back to local then `git checkout master` > `git pull origin master` > `git merge *new-branch-name*` resolving conflicts.
10. Once all fixed and on your master locally `git push origin master` to push onto github master.