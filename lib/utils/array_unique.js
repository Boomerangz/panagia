Array.prototype.unique = function unique() {
    return Array.from(new Set(this));
}