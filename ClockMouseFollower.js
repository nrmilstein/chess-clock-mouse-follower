class ClockMouseFollower {
  constructor() {
    this.el = document.createElement("div");
    this.el.classList.add("clock-mouse-follower");

    this.times = { bottom: null, top: null };

    this.x = 0;
    this.y = 0;

    this.isMounted = false;
    this.hasMouseMoved = false;

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
    if (!this.isMounted) {
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

  isVisible() {
    return this.isMounted && this.hasMouseMoved && this.times.top !== null && this.times.bottom !== null;
  }

  render() {
    if (this.isVisible()) {
      this.el.style.display = "block";
    } else {
      this.el.style.display = "none";
      return;
    }

    this.el.style.left = String(this.x + 18) + "px";
    this.el.style.top = String(this.y - (this.el.offsetHeight / 2.0)) + "px";

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
