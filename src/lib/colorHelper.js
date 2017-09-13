export class ColorHelper {
  static GREEN = {r: 61, g: 181, b: 83};
  static BROWN = {r: 102, g: 77, b: 0};
  static RED = {r: 255, g: 0, b: 0};
  static ORANGE = {r: 160, g: 161, b: 100};
  static DARK_BLUE = {r: 27, g: 72, b: 124};

  constructor() {
    this.colorMap = {};
  }

  setPlayerColor(id, color) {
    this.colorMap[id] = color;
  }

  getPlayerColor(player) {
    if( !(player.id in this.colorMap) ) {
      let color = ColorHelper.getEnemyRGB();
      color.a = ColorHelper.getPlayerAlpha(player);
      this.colorMap[player.id] = ColorHelper.getRGBString(color);
    }
    
    return this.colorMap[player.id];
  }

  static getPlayerAlpha(player) {
    return player.startTime > Date.now() ? (Math.sin(Date.now()/30) + 1)/2 : 1;
  }

  static getEnemyRGB()
  {
    return this.getColorFromGradient(this.RED, this.ORANGE, Math.random());
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

  static getRGBString(color) {
    let alpha = color.a ? color.a : 1;
    color.a = alpha;
    return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
  }
}