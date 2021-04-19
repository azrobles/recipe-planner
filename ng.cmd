@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "NG=%~dp0\node_modules\@angular\cli\bin\ng"

"%NODE_EXE%" "%NG%" %*
