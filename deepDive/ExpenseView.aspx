<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ExpenseView.aspx.vb" Inherits="DsttsBoard_ExpenseView" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<%@ Register Assembly="TaeyoNetLib" Namespace="TaeyoNetLib" TagPrefix="taeyo" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <title>제목 없음</title>

    <script type="text/javascript" language="JavaScript"> 
        var initBody
        function beforePrint() {
            initBody = document.body.innerHTML;
            document.body.innerHTML = idPrint.innerHTML;
        }

        function afterPrint() {
            document.body.innerHTML = initBody;
        }

        function printArea() {
            window.print();
        }

        window.onbeforeprint = beforePrint;
        window.onafterprint = afterPrint;
    </script>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

        * {
            font-family: "Noto Sans KR", serif;
        }

        a:visited,
        a:link {
            text-decoration: underline;
            text-decoration-color: red;
            color: black;
        }

        a:active {
            text-decoration: none;
            color: black;
        }

        a:hover {
            text-decoration: none;
            color: dodgerblue;
        }

        font:hover {
            color: dodgerblue;
        }

        select, input[type="text"], input[type="date"] {
            font-family: "Noto Sans KR", serif;
            height: 28px;
            border: 1px solid #aaa;
            border-radius: 3px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            box-sizing: border-box;
        }

        input[type="date"] {
            margin-top: 3px;
        }

        td {
            font-size: 14px;
            padding: 0;
            border: 0;
        }

        .table_header {
            height: 48px;
            border-top: 1px solid #cecece;
            border-bottom: 2px solid #598CBD;
        }

        #chkDeEx,
        #chk1,
        #chk2,
        #chk3,
        #chk4 {
            font-size: 15px;
            width: 16px;
            height: 16px;
            margin: 0;
            margin-right: 5px;
            vertical-align: middle;
            cursor: pointer;
        }

            #chkDeEx + label,
            #chk1 + label,
            #chk2 + label,
            #chk3 + label,
            #chk4 + label {
                font-size: 15px;
                line-height: 16px;
                cursor: pointer;
                vertical-align: middle;
            }

        #cmdSearch {
            width: 80px;
            height: 28px;
            background-color: #fff;
            border: 1px solid #598CBD;
            color: #598CBD;
            border-radius: 3px;
            padding: 10px;
            line-height: 0px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            vertical-align: bottom;
            margin-left: 5px;
        }

            #cmdSearch:hover {
                background-color: #598CBD;
                color: #fff;
            }

        input[type="text"] {
            cursor: text;
        }

        .wrapper > table {
            width: calc(100vw - 200px);
            max-width: 1340px;
            min-width: 1100px;
        }

        #fpsList td {
            text-align: center;
        }

        #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
            border-bottom: 1px solid #eee;
            height: 40px;
        }

        .f1 tr {
            display: inline-block;
        }

        #radSelect td {
            position: relative;
        }

        #radSelect_1,
        #radSelect_0 {
            display: none;
        }

        label[for="radSelect_1"],
        label[for="radSelect_0"] {
            display: inline-block;
            width: 40px;
            text-align: center;
            padding: 5px 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-left: 0;
            font-size: 17px;
            color: #999;
            cursor: pointer;
        }

        label[for="radSelect_0"] {
            position: absolute;
            bottom: -18px;
            left: -4px;
            border-radius: 3px 0 0 0;
        }

        label[for="radSelect_1"] {
            position: absolute;
            bottom: -18px;
            left: 73px;
            border-radius: 0 3px 0 0;
        }

        #radSelect_1:checked + label,
        #radSelect_0:checked + label {
            background-color: #f3f3f3;
            color: #666;
            border-bottom: 1px solid #f3f3f3;
        }

        #cmbSave {
            display: none;
        }
    #cmbSave2{
    width: 100px;
    height: 30px;
    background-color: #598CBD;
    color: #fff;
    font-size: 16px;
    border: 0;
    border-radius: 3px;
    }

        @media screen and (min-width: 1200px) {
            td {
                font-size: 15px;
            }

            #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
                border-bottom: 1px solid #eee;
                height: 50px;
            }
        }
    </style>
</head>
<body>
    <form id="ExpenseView" runat="server">
        <div class="wrapper">
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <table>
                <tr>
                    <td align="left" style="width: 100%; height: 17px; padding-top: 20px; padding-left: 10px;">
                        <asp:Label ID="Label1" runat="server" Style="font-weight: 500; font-size: 22px;">지출 품의서 처리작업</asp:Label>
                        <asp:ImageButton ID="BtnPrint" runat="server" ImageUrl="~/DsttsBoard/Image/Print.GIF" Style="vertical-align: bottom; height: 28px; margin-left: 10px;" />
                    </td>
                </tr>
                <tr style="height: 20px;"></tr>
                <tr style="height: 30px;">
                    <td colspan="2" class="f1">
                        <asp:RadioButtonList ID="radSelect" runat="server">
                            <asp:ListItem Selected="True" Value="0">전표</asp:ListItem>
                            <asp:ListItem Value="1">처리</asp:ListItem>
                        </asp:RadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="width: 100%; height: 17px;">
                        <table style="width: 100%; height: 28px; border-collapse: collapse; background-color: #f3f3f3; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                            <tr style="height: 38px;">
                                <td valign="middle" colspan="2" style="padding: 20px 0 6px 100px;">
                                    <asp:Button ID="cmd001" runat="server" Text="전체" />
                                    <asp:Button ID="cmd002" runat="server" Text="송금" />
                                    <asp:Button ID="cmd003" runat="server" Text="현금" />
                                    <asp:Button ID="cmd004" runat="server" Text="카드" />
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">날 &nbsp; &nbsp; &nbsp; 짜</td>
                                <td style="vertical-align: middle; text-align: left;">
                                    <asp:TextBox ID="txtDate" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                    <span style="display: inline-block; text-align: center; width: 20px; font-size: 16px; line-height: 11px;">~</span>
                                    <asp:TextBox ID="txtDate2" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                    <asp:CheckBox ID="chkCallDate" runat="server" Text="미입금, 입금요청일 오늘 이후 기준" />
                                </td>
                                <%--<td align="center" style="font-weight: bold;  width: 35%" valign="middle">
                                    <asp:TextBox ID="txtDate" runat="server" BorderWidth="1px" Style="width: 70px; text-align: center"></asp:TextBox>&nbsp;<asp:ImageButton ID="cmdCal" runat="server"
                                        ImageUrl="~/PriVate/Images/Calendar_scheduleHS.png" />
                                    부터 &nbsp; &nbsp;<asp:TextBox ID="txtDate2" runat="server" BorderWidth="1px"
                                        Style="width: 70px; text-align: center"></asp:TextBox>&nbsp;<asp:ImageButton ID="cmdCal2"
                                            runat="server" ImageUrl="~/PriVate/Images/Calendar_scheduleHS.png" />
                                    까지<br />
                                    <asp:CheckBox ID="chkCallDate" runat="server" Text="미입금,입금요청일 오늘 이후 기준" />
                                </td>--%>
                            </tr>
                            <tr style="height: 10px;"></tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">구 &nbsp; &nbsp; &nbsp; 분</td>
                                <td>
                                    <asp:CheckBox ID="chk1" runat="server" Text="승인" />&nbsp;
                                    <asp:CheckBox ID="chk2" runat="server" Text="미처리" />&nbsp;
                                    <asp:CheckBox ID="chk3" runat="server" Text="미영수" />
                                    <asp:DropDownList ID="cmbSection" runat="server">
                                        <asp:ListItem Value="0">송금</asp:ListItem>
                                        <asp:ListItem Value="1">출금</asp:ListItem>
                                        <asp:ListItem Value="2">카드</asp:ListItem>
                                        <asp:ListItem Selected="True" Value="3">전체</asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">작&nbsp; 성 &nbsp;자</td>
                                <td>
                                    <asp:TextBox ID="txtUserName" runat="server" BorderWidth="1px" Width="400px"></asp:TextBox>
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">제 &nbsp; &nbsp; &nbsp; 목</td>
                                <td>
                                    
                                    <asp:TextBox ID="txtTitle" runat="server" BorderWidth="1px" Width="400px"></asp:TextBox>
                                    <%--<asp:ImageButton ID="cmdSearch" runat="server" ImageUrl="~/images/button/btn_search.gif" />--%>
                                    <asp:Button ID="cmdSearch" runat="server" Text="검색" />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <%--화면에 안보임..?--%>
                                    <asp:ImageButton ID="cmdSave" runat="server" ImageUrl="~/images/button/btn_edit.gif" />
                                </td>
                            </tr>
                            <tr style="height: 14px;"></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="right" style="width: 100%; height: 17px; padding: 10px;">
                        <button type="button" id="cmbSave2" onclick="this.addEventListener('click', () => document.getElementById('cmbSave').click())">저장</button>
                        <asp:Button ID="cmbSave" runat="server" Text="저장" />
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%">
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <table class="auto-style1" style="width: 100%;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <asp:Label ID="labTotal" runat="server" Font-Size="20pt" ForeColor="Red" Text="0"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td >
                                            <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" PageSize="20" Width="100%">
                                                <EditItemStyle BackColor="#2461BF" />
                                                <SelectedItemStyle BackColor="#598CBD" Font-Bold="True" ForeColor="#333333" />
                                                <PagerStyle BackColor="#f3f3f3" ForeColor="#555555" HorizontalAlign="Center" Mode="NumericPages" />
                                                <HeaderStyle HorizontalAlign="Center" CssClass="table_header"/>
                                                <Columns>
                                                    <asp:TemplateColumn HeaderText="구분">
                                                        <ItemTemplate>
                                                            &nbsp;<asp:DropDownList ID="cmbList" runat="server">
                                                                <asp:ListItem Value="0">0:송금</asp:ListItem>
                                                                <asp:ListItem Value="1">1:출금</asp:ListItem>
                                                                <asp:ListItem Value="2">2:카드</asp:ListItem>
                                                            </asp:DropDownList>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn HeaderText="문서번호">
                                                        <ItemStyle Font-Bold="True" Font-Italic=
                                                        "False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />+++++++++++++++++++
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}" HeaderText="일자">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="username" HeaderText="작성자">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn HeaderText="승인여부">
                                                        <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="title" FooterText="합계금액" HeaderText="제목"></asp:BoundColumn>
                                                    <asp:TemplateColumn HeaderText="처리여부">
                                                        <HeaderTemplate>
                                                            처리여부
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tr>
                                                                    <td align="center" style="width: 100%">
                                                                        <asp:Label ID="labExpen3" runat="server" Font-Bold="False" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text1").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text2").ToString %><br /><%#DataBinder.Eval(Container.DataItem, "text7").ToString%></asp:Label>
                                                                        <asp:ImageButton ID="cmdExpen01" runat="server" CommandName="Expense01" ImageUrl="~/DsttsBoard/Image/Expen01.gif" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="width: 100%"></td>
                                                                </tr>
                                                            </table>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="영수증수령">
                                                        <HeaderTemplate>
                                                            영수여부
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tr>
                                                                    <td align="center" style="width: 100%">
                                                                        <asp:Label ID="labExpen4" runat="server" Font-Bold="False" ForeColor="Navy"><%# DataBinder.Eval(Container.DataItem, "text3").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text4").ToString %><br /><%# DataBinder.Eval(Container.DataItem, "text8").ToString %></asp:Label>
                                                                        <asp:ImageButton ID="cmdExpen02" runat="server" CommandName="Expense02" ImageUrl="~/DsttsBoard/Image/Expen02.gif" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="width: 100%"></td>
                                                                </tr>
                                                            </table>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn DataField="amount" DataFormatString="{0:n0}" HeaderText="합계금액">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Right" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                                    <asp:TemplateColumn HeaderText="입금요청일">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsPurcDate" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="재무요청일">
                                                        <HeaderTemplate>
                                                            재무팀요청일
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <asp:TextBox ID="txtsCallDate" runat="server" Height="17px" Text="" Width="80px"></asp:TextBox>
                                                        </ItemTemplate>
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="재무팀요청금액">
                                                        <ItemTemplate>
                                                            <asp:TextBox ID="txtsCallAmount" runat="server" Height="17px" Text="" Width="80px"></asp:TextBox>
                                                        </ItemTemplate>
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Right" />
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="custcode" Visible="False">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsCustCode" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="yymm" Visible="False">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsYymm" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="Update">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Button ID="cmdsCall" runat="server" CommandName="nsCall" Text="Call" />
                                                            <asp:Label ID="labsUpdate" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                                </Columns>
                                            </asp:DataGrid>
                                        </td>
                                    </tr>
                                </table>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                        <asp:DataGrid ID="fpsList2" runat="server" AutoGenerateColumns="False"
                            CellPadding="4" ForeColor="#333333" Width="100%" Visible="False">
                            <EditItemStyle BackColor="#2461BF" />
                            <SelectedItemStyle BackColor="#598CBD" Font-Bold="True" ForeColor="#333333" />
                            <PagerStyle BackColor="#f3f3f3" ForeColor="#555555" HorizontalAlign="Center" Mode="NumericPages" />
                            <HeaderStyle BackColor="#507CD1" Font-Bold="True"
                                ForeColor="White" HorizontalAlign="Center" />
                            <Columns>
                                <asp:TemplateColumn HeaderText="구분">
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labStatus" runat="server" Font-Bold="True"></asp:Label></td>
                                            </tr>
                                        </table>
                                        &nbsp;
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:BoundColumn HeaderText="문서번호">
                                    <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="일자" DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="작성자" DataField="username">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="승인여부">
                                    <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn FooterText="합계금액" HeaderText="제목" DataField="title"></asp:BoundColumn>
                                <asp:TemplateColumn HeaderText="처리여부">
                                    <HeaderTemplate>
                                        처리여부
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labExpen01" runat="server" Font-Bold="False" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text1").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text2").ToString %></asp:Label>
                                                </td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:TemplateColumn HeaderText="영수증수령">
                                    <HeaderTemplate>
                                        영수여부
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labExpen02" runat="server" Font-Bold="False" ForeColor="Navy"><%# DataBinder.Eval(Container.DataItem, "text3").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text4").ToString %></asp:Label></td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:BoundColumn HeaderText="합계금액" DataField="amount" DataFormatString="{0:n0}">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Right" />
                                </asp:BoundColumn>
                                <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                            </Columns>
                        </asp:DataGrid>
                        <br />
                        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False"
                            EnableModelValidation="True" Visible="False">
                            <Columns>
                                <asp:TemplateField HeaderText="구분">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labStatus" runat="server" Font-Bold="True"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField HeaderText="문서번호" />
                                <asp:BoundField DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}"
                                    HeaderText="일자" />
                                <asp:BoundField DataField="username" HeaderText="작성자" />
                                <asp:BoundField HeaderText="승인여부" />
                                <asp:BoundField DataField="title" HeaderText="제목" />
                                <asp:TemplateField HeaderText="처리여부">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labExpen01" runat="server" Font-Bold="False"
                                            ForeColor="#0000C0"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField HeaderText="영수여부">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox3" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labExpen02" runat="server" Font-Bold="False"
                                            ForeColor="Navy"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField HeaderText="합계금액" DataField="amount"
                                    DataFormatString="{0:n0}" />
                            </Columns>
                        </asp:GridView>
                    </td>
                </tr>
                <tr>
                    <td align="right" style="width: 100%"></td>
                </tr>
                <tr>
                    <td align="center" style="width: 100%">&nbsp; &nbsp;</td>
                </tr>
            </table>


            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal" TargetControlID="txtDate"></ajaxToolkit:CalendarExtender>
            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender2" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal2" TargetControlID="txtDate2"></ajaxToolkit:CalendarExtender>
        </div>
    </form>
</body>
</html>
