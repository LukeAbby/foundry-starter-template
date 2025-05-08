// The `export {}` is necessary because the file does not contain any top-level import/export statements.
// `import Document = ...` does not count.
//
// Once you add an import or export statement, you can remove the `export {}`.
export {};

// If you are writing a system then this file will be of use of you.
// Otherwise you can delete it.
declare module "fvtt-types/configuration" {
  // foundry-vtt-types needs to know what documents you register with Foundry at runtime.
  // You can configure every document class here.
  //
  // Tip 1: Make sure you import the document class and make sure the key is spelled right.
  // Tip 2: If you want to make sure it's working, try writing `type TestConfiguration = Actor.Implementation;`
  //        replacing `"Actor"` with the document type you're working with.
  //        If hovering `TestConfiguration` says `typeof MyActor`, congratulations! It's working.
  // Tip 2: If `MyActor` has generic parameters (with OR without defaults), you need to provide them here.
  //        For example `typeof Actor<Actor.SubType>`. Make sure that the generic parameters are as wide as possible.
  interface DocumentClassConfig {}

  // foundry-vtt-types needs to know what data models you register with Foundry at runtime.
  interface DataModelConfig {}
}

type TestConfiguration = Actor.Implementation;
