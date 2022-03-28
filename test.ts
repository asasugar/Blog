







class Person {
   name: string
  constructor(name: string) {
      this.name = name
  }
  speak() {
      console.log(`${this.name} is speaking`)
  }
}
class Student extends Person {
  grade: number
  constructor(name: string,grade:number) {
      super(name)
      this.grade = grade
  }
}

const s1 = new Student('Sugar')

s1.
