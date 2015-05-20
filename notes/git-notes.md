Git commonly used commands
==========================


Syncing a fork with original repo
---

https://help.github.com/articles/syncing-a-fork/

```bash
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```


Showing changes from previous commit
---

```bash
git diff HEAD^ HEAD
```


Show pretty git log
---

```bash
git log --decorate=full --graph
```


Show all branches
---

```bash
git branch -a
```

Get the status
---

```bash
git status
```


Commit all tracked changed files
---

```bash
git commit -a
```

Amend the commit message
---

I've run into the problem where a push fails because of a policy violation.  To ammend the commit message:

```bash
git commit --amend -m 'message that resolves the policy violation'
```


Listing config options
---

```bash
git config --list
```

Changing username/email (local only)
---

```bash
git config user.name USERNAME
git config user.email EMAIL
```


Create and checkout new branch
---

```bash
git checkout -b NEW_BRANCH
```

Push a local branch upstream
---

```bash
git push -u origin NEW_BRANCH
```

Restore a file (all untracked changes will be lost)
---

```bash
git checkout -- FILE
```




