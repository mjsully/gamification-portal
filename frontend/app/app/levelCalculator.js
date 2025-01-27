function LevelCalculator(user) {

  var currentXp = user.xp;
  var currentLevel = Math.floor(Math.cbrt(currentXp))
  var currentLevelXp = currentLevel ** 3;
  var nextLevelXp = (currentLevel + 1) ** 3
  var currentLevelPercentage = (100 * (currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp))
  var levelObject = {
    "currentXp": currentXp,
    "currentLevel": currentLevel,
    "nextLevelXp": nextLevelXp,
    "currentLevelPercentage": currentLevelPercentage,
    "progressBarData": currentXp + " / " + nextLevelXp + " XP"
  }
  return levelObject
}

export default LevelCalculator;