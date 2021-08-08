class ClockMouseFollower {
  constructor() {
    this.el = document.createElement("div");
    this.el.classList.add("clock-mouse-follower");

    this.times = { bottom: null, top: null };

    this.x = 0;
    this.y = 0;

    this.isMounted = false;
    this.hasMouseMoved = false;
    this.isGameOver = false;

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseMove(event) {
    if (!this.hasMouseMoved) {
      this.hasMouseMoved = true;
    }
    this.x = event.pageX;
    this.y = event.pageY;
    this.render();
  }

  setTimeTop(time) {
    this.times.top = time;
    this.render();
  }

  setTimeBottom(time) {
    this.times.bottom = time;
    this.render();
  }

  mount() {
    if (!this.isMounted && !this.isGameOver) {
      this.isMounted = true;
      document.body.appendChild(this.el);
      window.addEventListener("mousemove", this.handleMouseMove);
      this.render();
    }
  }

  unmount() {
    if (this.isMounted) {
      this.isMounted = false;
      window.removeEventListener("mousemove", this.handleMouseMove);
      this.el.remove();
    }
  }

  gameOver() {
    this.unmount();
    this.isGameOver = true;
  }

  isVisible() {
    return this.isMounted && this.hasMouseMoved && this.times.top !== null && this.times.bottom !== null;
  }

  async render() {
    if (this.isVisible()) {
      this.el.style.display = "block";
    } else {
      this.el.style.display = "none";
      return;
    }

    const PADDING = {
      top: 12,
      right: 20,
      bottom: 30,
      left: 16,
    }

    const CORNER_REVERSE_PADDING = 3;

    let xOffset, yOffset;

    switch (await Options.get('position')) {
      case "centerRight":
        xOffset = PADDING.right;
        yOffset = -this.el.offsetHeight / 2;
        break;
      case "bottomRight":
        xOffset = PADDING.right - CORNER_REVERSE_PADDING;
        yOffset = PADDING.bottom - CORNER_REVERSE_PADDING;
        break;
      case "bottomCenter":
        xOffset = -this.el.offsetWidth / 2;
        yOffset = PADDING.bottom;
        break;
      case "bottomLeft":
        xOffset = -this.el.offsetWidth - PADDING.left + CORNER_REVERSE_PADDING;
        yOffset = PADDING.bottom - CORNER_REVERSE_PADDING;
        break;
      case "centerLeft":
        xOffset = -this.el.offsetWidth - PADDING.left;
        yOffset = -this.el.offsetHeight / 2;
        break;
      case "topLeft":
        xOffset = -this.el.offsetWidth - PADDING.left + CORNER_REVERSE_PADDING;
        yOffset = -this.el.offsetHeight - PADDING.top - CORNER_REVERSE_PADDING;
        break;
      case "topCenter":
        xOffset = -(this.el.offsetWidth / 2);
        yOffset = -this.el.offsetHeight - PADDING.top;
        break;
      case "topRight":
        xOffset = PADDING.right - CORNER_REVERSE_PADDING;
        yOffset = -this.el.offsetHeight - PADDING.top + CORNER_REVERSE_PADDING;
        break;
    }

    this.el.style.left = String(this.x + xOffset) + "px";
    this.el.style.top = String(this.y + yOffset) + "px";

    const timeComparison = this.times.top.compare(this.times.bottom);

    const hasTenths = this.times.top.tenths !== null || this.times.bottom.tenths !== null;
    const topTime = this.times.top.format(hasTenths);
    const bottomTime = this.times.bottom.format(hasTenths);

    this.el.innerHTML = `
    <div class="timeTop">
      ${topTime}
    </div>
    <div class="timeBottom ${timeComparison > 0 ? "timeCritical" : "timeOk"}">
    ${bottomTime}
    </div>
    `
  }

}
