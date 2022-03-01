import { join, dirname } from "https://deno.land/std/path/mod.ts";

export async function loadTestFiles(instance: any, directory: string) {
  const fileMap = new Map<string, string>();

  await readFiles(fileMap, directory, '.');

  for(const [from, to] of fileMap){
    const content = await Deno.readFile(from);
    ensureDirExists(instance.FS, dirname(to));
    instance.FS.writeFile(to, content);
  }
}

function ensureDirExists(fs: any, path: string){
  try{
    fs.stat(path);
  }catch(e){
    ensureDirExists(fs, dirname(path));
    fs.mkdir(path);
  }
}

async function readFiles(map: Map<string, string>, root: string, location: string) {
  const cwd = join(root, location);
  for await (const testFile of Deno.readDir(cwd)) {
    if(testFile.isDirectory){
      await readFiles(map, root, join(location, testFile.name));
    }else{
      map.set(join(cwd, testFile.name), join('/', location, testFile.name))
    }
  }
}
