export class ColorHelper {
  static GREEN = {r: 61, g: 181, b: 83};
  static BROWN = {r: 102, g: 77, b: 0};

  static getPlayerAlpha(player) {
    return player.startTime > Date.now() ? (Math.sin(Date.now()/30) + 1)/2 : 1;
  }

  static getEnemyRGB()
  {
    let red = {
      r: 255,
      g: 0,
      b: 0,
    };

    let orange = {
      r: 160,
      g: 161,
      b: 100,
    };

    let r = Math.floor((red.r - orange.r) * Math.random() + orange.r);
    let g = Math.floor(orange.g * Math.random());
    let b = Math.floor(orange.b * Math.random());
    
    return {r: r, g: g, b: b};
  }

  static getColorFromGradient(color1, color2, weight) {
    let base = color1;

    let r = Math.floor(base.r + (color2.r - color1.r) * weight);
    let g = Math.floor(base.g + (color2.g - color1.g) * weight);
    let b = Math.floor(base.b + (color2.b - color1.b) * weight);

    return {r: r, g: g, b: b};
  }

  static getFoodColorWeight(food) {
    let totalDuration = food.endTime - food.startTime;
    let passedTime = Date.now() - food.startTime;

    return Math.min(passedTime/totalDuration, 1);
  }
}